import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkUserAvailability } from './checkUserAvailability';

export const POST: RequestHandler = async ({ locals, request }) => {
  const { username } = await request.json();
  const available = await checkUserAvailability({ username, locals });
  return json({ available });
};
