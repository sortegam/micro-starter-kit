import { stripe } from '$lib/server/stripe';
import * as Sentry from '@sentry/sveltekit';
import type { Actions } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export const actions: Actions = {
  default: async (event) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // This priceID is created on the stripe page when you create a product
          price: 'price_1NxPJsGkGSTbj5HVSBNpET57',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://localhost:5173/pay/success/',
      cancel_url: 'https://localhost:5173/pay/cancel/',
      automatic_tax: { enabled: true },
    });

    if (session.url) {
      redirect(303, session.url);
    }

    Sentry.captureException(new Error('No session.url in checkout session'));

    // If we don't have session.url then we have an error
    redirect(
      302,
      '/',
      {
        type: 'error',
        message: 'There was an error creating the checkout session',
      },
      event
    );
  },
};
