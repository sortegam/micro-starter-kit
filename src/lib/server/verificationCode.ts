import { maxNumberOfFailedLogins, verificationCodeLength } from '$config';
import { generateRandomString } from '$lib/utils/generateRandomString';
import { eq } from 'drizzle-orm';
import { db, users, verificationCodes } from './db';

export async function generateVerificationCodeForUserId(userId: string) {
  const code = generateRandomString(
    verificationCodeLength,
    '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  );

  const values = {
    code,
    expiresAt: Date.now() + 1000 * 60 * 5,
    userId,
    updatedAt: Date.now(),
  };
  await db
    .insert(verificationCodes)
    .values(values)
    .onConflictDoUpdate({ target: verificationCodes.userId, set: { code } });
  return code;
}

export async function deleteVerificationCodeForUser(userId: string) {
  await db
    .delete(verificationCodes)
    .where(eq(verificationCodes.userId, userId));
}

export async function resetFailedLoginAttemptsForUser(userId: string) {
  await db
    .update(users)
    .set({ failedLoginAttempts: 0 })
    .where(eq(users.id, userId));
}

export async function verifyUserEmail(userId: string) {
  await db.update(users).set({ emailVerified: 1 }).where(eq(users.id, userId));
}

export class MaxNumberOfFailedLoginsError extends Error {
  constructor() {
    super('Max number of failed logins reached');
    this.name = 'MaxNumberOfFailedLoginsError';
  }
}

/**
 * NOTE on auth:
 * To go fast we are not throttling login attempts nor blocking users after a certain number of failed attempts.
 * We fake it! The only thing we do is to remove the verification code after X
 * failed attempts, so that a hacker cannot brute force the code.
 */
export async function verifyUserCodeAuth(code: string, email: string) {
  const userWithVerificationCode = db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .innerJoin(verificationCodes, eq(verificationCodes.userId, users.id))
    .limit(1)
    .get();

  if (!userWithVerificationCode) {
    return false;
  }

  if (
    userWithVerificationCode.users.failedLoginAttempts >=
    maxNumberOfFailedLogins
  ) {
    deleteVerificationCodeForUser(userWithVerificationCode.users.id);
    resetFailedLoginAttemptsForUser(userWithVerificationCode.users.id);
    throw new MaxNumberOfFailedLoginsError();
  }

  if (userWithVerificationCode.verification_codes.code === code) {
    // We reset failed attempts to 0 if the user successfully logs in
    resetFailedLoginAttemptsForUser(userWithVerificationCode.users.id);
    return userWithVerificationCode;
  }

  // We increment attempts by 1 if the user fails to log in
  await db
    .update(users)
    .set({
      failedLoginAttempts:
        userWithVerificationCode.users.failedLoginAttempts + 1,
    })
    .where(eq(users.id, userWithVerificationCode.users.id));
  return false;
}
