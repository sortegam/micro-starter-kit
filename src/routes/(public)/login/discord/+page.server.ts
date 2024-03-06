import { discordAuth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { initialPathForLoggedUsers } from '$config';
import { generateState } from 'arctic';

export const load: PageServerLoad = async ({ cookies, request, locals }) => {
  const basePath = new URL(request.url).origin;
  if (locals.user) {
    redirect(302, initialPathForLoggedUsers);
  }

  // generate state
  const state = generateState();

  // pass state (and code verifier for PKCE)
  // returns the authorization url only
  const authorizationURL = await discordAuth({
    basePath,
  }).createAuthorizationURL(state, { scopes: ['identify', 'email'] });

  cookies.set('discord_oauth_state', state, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60, // 10 minutes,
  });

  redirect(302, authorizationURL.toString());
};
