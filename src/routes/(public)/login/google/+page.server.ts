import { googleAuth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { initialPathForLoggedUsers } from '$config';
import { generateState, generateCodeVerifier } from 'arctic';

export const load: PageServerLoad = async ({ cookies, request, locals }) => {
  const basePath = new URL(request.url).origin;
  if (locals.user) {
    redirect(302, initialPathForLoggedUsers);
  }

  // generate state
  const state = generateState();

  const codeVerifier = generateCodeVerifier();

  // pass state (and code verifier for PKCE)
  // returns the authorization url only
  const authorizationURL = await googleAuth({
    basePath,
  }).createAuthorizationURL(state, codeVerifier, {
    scopes: ['email'], // pass scopes here instead
  });

  cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60, // 10 minutes,
  });

  cookies.set('google_oauth_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 10, // 1 minute,
  });

  redirect(302, authorizationURL.toString());
};
