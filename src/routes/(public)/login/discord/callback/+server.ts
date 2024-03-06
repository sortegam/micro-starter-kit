import { lucia, discordAuth } from '$lib/server/auth';
import type { RequestEvent, RequestHandler } from './$types';
import { OAuth2RequestError } from 'arctic';
import { redirect } from 'sveltekit-flash-message/server';
import { db, oauthAccounts, users } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import {
  DISCORD_STATE_COOKIE_NAME,
  INITIAL_PATH_FOR_DISCORD_SUCCESS_AUTH,
} from '../constants';

type DiscordBodyResponse = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  premium_type: number;
  flags: number;
  banner: null | string;
  accent_color: number;
  global_name: string;
  avatar_decoration_data: null | string;
  banner_color: string;
  mfa_enabled: boolean;
  locale: string;
  email: string;
  verified: boolean;
};

// #################################################################

async function createSessionAndRedirect(userId: string, event: RequestEvent) {
  const session = await lucia.createSession(userId, {});

  // `createSessionCookie()` now takes a session ID instead of the entire session object
  const sessionCookie = lucia.createSessionCookie(session.id);

  event.cookies.set(sessionCookie.name, sessionCookie.value, {
    ...sessionCookie.attributes,
    path: '/', // Since now path is mandatory we need to set it here.
  });

  return redirect(302, INITIAL_PATH_FOR_DISCORD_SUCCESS_AUTH);
}

// #################################################################

export const GET: RequestHandler = async (event) => {
  const redirectError = (message: string = 'Error when login user') => {
    const _message: App.PageData['flash'] = {
      type: 'error',
      message,
    };
    return redirect(303, '/login/', _message, event);
  };

  const { request, url, cookies } = event;
  const storedState = cookies.get(DISCORD_STATE_COOKIE_NAME);

  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return redirectError();
  }

  try {
    const basePath = new URL(request.url).origin;
    const discordTokens = await discordAuth({
      basePath,
    }).validateAuthorizationCode(code!);

    if (!discordTokens.accessToken) {
      return redirectError();
    }

    // Call discord API to get user info
    const discordResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${discordTokens.accessToken}`,
      },
    });

    const discordResponseBody =
      (await discordResponse.json()) as DiscordBodyResponse;

    if (
      discordResponseBody?.verified !== true ||
      !discordResponseBody?.id ||
      !discordResponseBody?.email
    ) {
      return redirectError();
    }

    const userOAuthFound = db
      .select()
      .from(oauthAccounts)
      .where(
        and(
          eq(oauthAccounts.providerId, 'discord'),
          eq(oauthAccounts.providerUserId, discordResponseBody.id)
        )
      )
      .limit(1)
      .get();

    const userFoundByEmail = db
      .select()
      .from(users)
      .where(eq(users.email, discordResponseBody.email))
      .limit(1)
      .get();

    // #################################################################
    // # User is found in oAuthAccounts
    // #################################################################

    if (userOAuthFound) {
      return await createSessionAndRedirect(userOAuthFound.userId, event);
    }

    // #################################################################
    // # User is not found
    // # If user is not found then we need to create it.
    // # newUserId will change depending if the user is already created
    // # or is an actual new user.
    // #################################################################

    const newUserId = userFoundByEmail
      ? userFoundByEmail.id // User already exists, then use the id
      : crypto.randomUUID(); // User does not exists, then create a new id

    await db.transaction(async (tx) => {
      if (!userFoundByEmail) {
        await tx.insert(users).values({
          id: newUserId,
          email: discordResponseBody.email,
          // This probably is not needed at this point since we don't allow
          // the user to login with a verified email address in previous steps.
          emailVerified: discordResponseBody.verified ? 1 : 0,
        });
      }
      await tx.insert(oauthAccounts).values({
        providerId: 'discord',
        providerUserId: discordResponseBody.id,
        userId: newUserId,
      });
    });

    return await createSessionAndRedirect(newUserId, event);
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      // invalid code
      redirectError();
    } else {
      console.error(e);
    }
  }

  redirect(302, INITIAL_PATH_FOR_DISCORD_SUCCESS_AUTH);
};
