import { isBlacklistedUsername } from '$lib/server/blacklistedUsernames';
import { db, users } from '$lib/server/db';
import { eq } from 'drizzle-orm';

interface CheckUserAvailabilityParams {
  username?: string;
  locals: App.Locals;
}

export const checkUserAvailability = async ({
  username,
  locals,
}: CheckUserAvailabilityParams) => {
  // We do not allow the user to reach this endpoint unless a session is active
  if (!locals.session) {
    return false;
  }

  if (!username) {
    return false;
  }

  try {
    const user = db
      .select()
      .from(users)
      .where(eq(users.usernameNormalized, username.toLowerCase()))
      .limit(1)
      .get();

    if (
      user?.usernameNormalized === username.toLowerCase() ||
      isBlacklistedUsername(username.toLowerCase())
    ) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
