import type { PageServerLoad } from './$types';
import { stripe } from '$lib/server/stripe';

export const load: PageServerLoad = async () => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    return {
      error: (error as Error).message,
    };
  }
};
