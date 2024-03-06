import { lucia, googleAuth } from '$lib/server/auth';
import type { RequestEvent, RequestHandler } from './$types';
import { OAuth2RequestError } from 'arctic';
import { redirect } from 'sveltekit-flash-message/server';
import { initialPathForLoggedUsers } from '$config';
import { db, oauthAccounts, users } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { parseJWT } from 'oslo/jwt';
import {
  GOOGLE_CODE_VERIFIER_NAME,
  GOOGLE_STATE_COOKIE_NAME,
} from '../constants';

type GoogleJWTPayload = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  nonce: string;
  iat: number;
  exp: number;
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

  return redirect(302, initialPathForLoggedUsers);
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
  const storedState = cookies.get(GOOGLE_STATE_COOKIE_NAME);
  const codeVerifier = cookies.get(GOOGLE_CODE_VERIFIER_NAME);

  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  // validate state
  if (
    !storedState ||
    !state ||
    storedState !== state ||
    !code ||
    !codeVerifier
  ) {
    return redirectError();
  }

  try {
    const basePath = new URL(request.url).origin;
    const googleTokens = await googleAuth({
      basePath,
    }).validateAuthorizationCode(code!, codeVerifier!);

    const parsedJWT = parseJWT(googleTokens.idToken);
    const googleJWTPayload =
      parsedJWT?.payload && (parsedJWT?.payload as GoogleJWTPayload);

    if (
      googleJWTPayload?.email_verified !== true ||
      !googleJWTPayload?.sub ||
      !googleJWTPayload?.email
    ) {
      return redirectError();
    }

    const userOAuthFound = db
      .select()
      .from(oauthAccounts)
      .where(
        and(
          eq(oauthAccounts.providerId, 'google'),
          eq(oauthAccounts.providerUserId, googleJWTPayload.sub)
        )
      )
      .limit(1)
      .get();

    const userFoundByEmail = db
      .select()
      .from(users)
      .where(eq(users.email, googleJWTPayload.email))
      .limit(1)
      .get();

    // #################################################################
    // # User is found in oAuthAccounts
    // #################################################################

    if (userOAuthFound) {
      return createSessionAndRedirect(userOAuthFound.userId, event);
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
          email: googleJWTPayload.email,
          // This probably is not needed at this point since we don't allow
          // the user to login with a verified email address in previous steps.
          emailVerified: googleJWTPayload.email_verified ? 1 : 0,
        });
      }
      await tx.insert(oauthAccounts).values({
        providerId: 'google',
        providerUserId: googleJWTPayload.sub,
        userId: newUserId,
      });
    });

    return createSessionAndRedirect(newUserId, event);
  } catch (e) {
    console.error(e);
    if (e instanceof OAuth2RequestError) {
      // invalid code
      redirectError();
    } else {
      console.error(e);
    }
  }

  redirect(302, initialPathForLoggedUsers);
};
