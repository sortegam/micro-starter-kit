import range from 'lodash/range';
import { loginCheckEmailSchema } from '../loginCheckEmail.schema';
import { verificationCodeLength } from '$config';
import * as v from 'valibot';

// #################################################################
// # Login Check Email + Verification Code Schema
// #################################################################

// This is to validate the verification code inputs
const verificationCodeInputsValidation: Record<string, v.BaseSchema> = {};

range(0, verificationCodeLength).forEach((idx) => {
  verificationCodeInputsValidation[`code-input-${idx.toString()}`] = v.string([
    v.length(1, 'Please enter a valid code'),
  ]);
});

export const loginWithCodeSchema = v.merge([
  loginCheckEmailSchema,
  v.object({ ...verificationCodeInputsValidation }),
]);

export type LoginWithCodeSchema = typeof loginWithCodeSchema;
