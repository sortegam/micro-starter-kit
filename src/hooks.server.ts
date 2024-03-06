import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { publicRoutes } from './config';
import { dev } from '$app/environment';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { RATE_LIMITER_ENABLED } from '$env/static/private';
import { db, users } from '$lib/server/db';
import { eq } from 'drizzle-orm';

if (PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1,
    environment: import.meta.env.MODE ?? 'development',
  });
}

// This is the rate limiter for this specific page
const globalLimiter = new RateLimiter({
  // A rate is defined as [number, unit]
  rates: {
    IP: [52, '15s'], // IP address limiter
    IPUA: [51, '15s'], // IP + User Agent limiter
    // cookie: {
    //   // Cookie limiter
    //   name: `${PROJECT_PREFIX}_rl_login`, // Unique cookie name for this limiter
    //   secret: RATE_LIMITER_COOKIE_SECRET,
    //   rate: [10, 'm'],
    //   preflight: true, // Require preflight call (see load function)
    // },
  },
});

/**
 * Using Glob pattern matching returns true or false depending if the path
 * passed matches any entry on the publicRoutes imported array.
 */
export function matchesPublicRoutes(path: string) {
  const match = publicRoutes.some((rx) => rx.test(path));
  return match;
}

export const handle: Handle = sequence(
  Sentry.sentryHandle(),
  async ({ event, resolve }) => {
    const populateLocalsUser = (userId: string) => {
      // We don't follow exactly the same pattern as the lucia library
      // what we do is to add all the user data into the event.locals.user
      // Because lucia doesn't infer well the type when getting attributes from DB.
      const user = db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .get();

      if (user) {
        event.locals.user = user;
      }
    };

    // #################################################################
    // # Global limiter enablement
    // #################################################################

    if (
      RATE_LIMITER_ENABLED === 'true' &&
      (await globalLimiter.isLimited(event))
    ) {
      error(429);
    }

    // #################################################################
    // # Handle 404 Not Found Routes
    // #################################################################

    if (!event.route.id) {
      // In this case it will show near +error.svelte
      return await resolve(event);
    }

    // #################################################################
    // # Handle Dev Routes
    // #################################################################

    // If in DEV env let pass de (dev) group routes folder
    if (dev && /^\/dev/.test(event.route.id)) {
      return await resolve(event);
    }

    // #################################################################
    // # Handle Session Id and locals prefill
    // #################################################################

    const sessionId = event.cookies.get(lucia.sessionCookieName);

    // If sessionId is not found then redirect to login
    if (!sessionId) {
      event.locals.user = null;
      event.locals.session = null;
      // If it's a public route then we don't need to redirect, but if
      // its it, then we go straight to login.
      if (!matchesPublicRoutes(event.route.id)) {
        return new Response('Redirect', {
          status: 302,
          headers: { Location: '/login/' },
        });
      }
      return await resolve(event);
    }

    // This is the fallback case since we want to protect all routes by default
    // least permission principle
    const { session } = await lucia.validateSession(sessionId);

    // If the session is fresh then we need to update the cookie
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes,
      });
      event.locals.session = session;
      populateLocalsUser(session.userId);
    }
    // If we have session but the event.locals.user is not populated,
    // then we populate it fetching the user from the database
    if (session) {
      event.locals.session = session;
      event.locals.session?.userId &&
        populateLocalsUser(event.locals.session?.userId);
    }

    // #################################################################
    // # Handle Public Routes
    // #################################################################

    // we can pass `event` because we used the SvelteKit middleware
    if (matchesPublicRoutes(event.route.id)) {
      // bypass
      return await resolve(event);
    }

    // #################################################################
    // # Handle Private Routes
    // #################################################################

    if (event.locals.session && event.locals.user) {
      if (event.locals.user.username) {
        return await resolve(event);
      } else {
        // No username then redirect to onboard
        return new Response('Redirect', {
          status: 302,
          headers: { Location: '/onboard/' },
        });
      }
    } else {
      return new Response('Redirect', {
        status: 302,
        headers: { Location: '/login/' },
      });
    }
  }
);

// #################################################################
// # Error Handler
// #################################################################

export const handleError = PUBLIC_SENTRY_DSN
  ? Sentry.handleErrorWithSentry()
  : undefined;
