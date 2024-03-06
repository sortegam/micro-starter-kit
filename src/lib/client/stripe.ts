import {
  PUBLIC_STRIPE_ENVIRONMENT,
  PUBLIC_STRIPE_KEY_LIVE,
  PUBLIC_STRIPE_KEY_TEST,
} from '$env/static/public';
import { loadStripe as _loadStripe } from '@stripe/stripe-js';

enum StripeEnvironment {
  TEST = 'TEST',
  LIVE = 'LIVE',
}

export const stripePublicKey =
  PUBLIC_STRIPE_ENVIRONMENT === StripeEnvironment.LIVE
    ? PUBLIC_STRIPE_KEY_LIVE
    : PUBLIC_STRIPE_KEY_TEST;

export const loadStripe = async () => await _loadStripe(stripePublicKey);
