import { lucia } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { DISCORD_STATE_COOKIE_NAME } from '$routes/(public)/login/discord/constants';
import {
  GOOGLE_CODE_VERIFIER_NAME,
  GOOGLE_STATE_COOKIE_NAME,
} from '$routes/(public)/login/google/constants';

export const load: PageServerLoad = async (event) => {
  const { locals } = event;
  if (!locals.session) {
    redirect(302, '/');
  }

  await lucia.invalidateUserSessions(locals.session.userId);

  // Clear all cookies associated with auth

  event.cookies.delete(lucia.sessionCookieName, { path: '/' });
  event.cookies.delete(GOOGLE_STATE_COOKIE_NAME, { path: '/' });
  event.cookies.delete(GOOGLE_CODE_VERIFIER_NAME, { path: '/' });
  event.cookies.delete(DISCORD_STATE_COOKIE_NAME, { path: '/' });

  redirect(
    302,
    '/login',
    { type: 'success', message: 'You have signed out' },
    event
  );
};
