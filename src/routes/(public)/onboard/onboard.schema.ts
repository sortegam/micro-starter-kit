import * as v from 'valibot';

// #################################################################
// # Onboard Schema
// #################################################################

export const usernameAllowedCharsRegex = /^[a-zA-Z0-9_.]+$/;

export const onboardSchema = v.object({
  username: v.string([
    v.minLength(3, 'Username must contain minimum 3 characters'),
    v.maxLength(30, 'Username must contain maximum 30 characters'),
    v.regex(
      usernameAllowedCharsRegex,
      'Username can only contain letters, numbers, underscores and dots'
    ),
  ]),
});

export type OnboardSchema = typeof onboardSchema;
