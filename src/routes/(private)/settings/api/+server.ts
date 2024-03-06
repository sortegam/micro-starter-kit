import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { settingsKeysWhitelist } from '../settings.config';
import { db, userSettings } from '$lib/server/db';
import { eq } from 'drizzle-orm';

// #################################################################
// # ENDPOINT
// #################################################################

/**
 * Endpoint to save settings
 */
export const POST: RequestHandler = async ({ locals, request }) => {
  const settings = await request.json();

  // Validation to prevent users from setting any key they want
  const invalidKeys = Object.keys(settings).filter(
    (key) => !settingsKeysWhitelist.includes(key)
  );

  if (invalidKeys.length) {
    const message = `Invalid setting keys: [${invalidKeys.join(', ')}]`;
    console.error(message);
    return json({ success: false, message }, { status: 400 });
  }

  if (!locals.session) {
    console.error('No session found');
    return json(null, { status: 401 });
  }

  try {
    await db
      .update(userSettings)
      .set(settings)
      .where(eq(userSettings.userId, locals.session.userId));
    return json({ ...settings });
  } catch (e) {
    console.error(e);
    return json({ success: false }, { status: 400 });
  }
};
