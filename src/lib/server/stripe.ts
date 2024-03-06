import {
  STRIPE_SECRET_KEY_LIVE,
  STRIPE_SECRET_KEY_TEST,
} from '$env/static/private';
import { PUBLIC_STRIPE_ENVIRONMENT } from '$env/static/public';
import Stripe from 'stripe';

enum StripeEnvironment {
  TEST = 'TEST',
  LIVE = 'LIVE',
}

export const stripeSecretKey =
  PUBLIC_STRIPE_ENVIRONMENT === StripeEnvironment.LIVE
    ? STRIPE_SECRET_KEY_LIVE
    : STRIPE_SECRET_KEY_TEST;

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});
