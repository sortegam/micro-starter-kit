import { isNonDisposableEmail } from '$lib/utils/disposableEmailChecker';
import * as v from 'valibot';

// #################################################################
// # Login Check Email Schema (Server Side)
// #################################################################

export const loginCheckEmailSchema = v.object({
  email: v.string([
    v.email('Please enter a valid email address'),
    v.custom(
      isNonDisposableEmail,
      'Sorry, disposable email addresses are not allowed'
    ),
  ]),
});
