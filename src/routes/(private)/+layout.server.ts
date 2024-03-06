import { db, userSettings } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const userId = locals.user?.id ?? null;

  if (!userId) {
    return {
      user: null,
      userSettings: null,
    };
  }
  let _userSettings = null;
  try {
    _userSettings = db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1)
      .get();
  } catch (e) {
    console.error(e);
    _userSettings = null;
  }

  return {
    user: locals.user ?? null,
    userSettings: _userSettings,
  };
};
