import { fail, type Actions, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { loginWithCodeSchema } from './loginWithCode.schema';
import type { PageServerLoad } from './$types';
import {
  MaxNumberOfFailedLoginsError,
  verifyUserCodeAuth,
  verifyUserEmail,
} from '$lib/server/verificationCode';
import { initialPathForLoggedUsers, verificationCodeLength } from '$config';
import range from 'lodash/range';
import { lucia } from '$lib/server/auth';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import {
  PROJECT_PREFIX,
  RATE_LIMITER_COOKIE_SECRET,
  RATE_LIMITER_ENABLED,
} from '$env/static/private';
import { valibot } from 'sveltekit-superforms/adapters';

// #################################################################

// This is the rate limiter for this specific page
const limiter = new RateLimiter({
  // A rate is defined as [number, unit]
  rates: {
    IP: [53, '30s'], // IP address limiter
    IPUA: [52, '30s'], // IP + User Agent limiter
    cookie: {
      // Cookie limiter
      name: `${PROJECT_PREFIX}_rl_login_code`, // Unique cookie name for this limiter
      secret: RATE_LIMITER_COOKIE_SECRET,
      rate: [51, '30s'],
      preflight: true, // Require preflight call (see load function)
    },
  },
});

// #################################################################

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, initialPathForLoggedUsers);
  }
  // Without this line all the direct posts to this route will be blocked :)
  if (RATE_LIMITER_ENABLED === 'true') {
    limiter.cookieLimiter?.preflight(event);
  }
  const loginForm = await superValidate(
    event.request,
    valibot(loginWithCodeSchema)
  );

  return {
    loginForm,
  };
};

// #################################################################

export const actions: Actions = {
  default: async (event) => {
    // Every call to isLimited counts as a hit towards the rate limit for the event.
    if (RATE_LIMITER_ENABLED === 'true' && (await limiter.isLimited(event)))
      error(429);
    // Use superValidate in form actions too, but with the request
    const loginForm = await superValidate(
      event.request,
      valibot(loginWithCodeSchema)
    );

    // Convenient validation check:
    if (!loginForm.valid) {
      // Again, always return { form } and things will just work.
      return fail(400, { loginForm });
    }

    const verificationCode = range(0, verificationCodeLength)
      .map((i) => loginForm.data[`code-input-${i}`])
      .join('');

    try {
      const userLogged = await verifyUserCodeAuth(
        verificationCode,
        loginForm.data.email
      );

      if (userLogged) {
        const session = await lucia.createSession(userLogged.users.id, {});
        // Set user email as verified in db
        // We can do that safely here since the user received the code into his email
        // so that we can ensure that the email is legit and the user is the owner.
        await verifyUserEmail(userLogged.users.id);

        const sessionCookie = lucia.createSessionCookie(session.id);

        event.cookies.set(sessionCookie.name, sessionCookie.value, {
          ...sessionCookie.attributes,
          path: '/', // Since now path is mandatory we need to set it here.
        });
        redirect(
          302,
          initialPathForLoggedUsers,
          { type: 'success', message: 'Code verified!' },
          event
        );
      } else {
        setFlash(
          {
            type: 'error',
            message: 'The verification code is incorrect.',
          },
          event
        );
        return fail(400, { loginForm });
      }
    } catch (err) {
      if (err instanceof MaxNumberOfFailedLoginsError) {
        redirect(
          302,
          '/',
          {
            type: 'error',
            // 5 minutes? Fake it until you make it...
            message: `You have reached the maximum number of failed login attempts. Please try again in 5 minutes.`,
          },
          event
        );
      } else {
        throw err;
      }
    }
  },
};
