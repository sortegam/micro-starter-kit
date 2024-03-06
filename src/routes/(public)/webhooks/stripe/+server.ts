import { stripe } from '$lib/server/stripe';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  if (signature === null) return new Response(undefined, { status: 400 });

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      '' //STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.warn('⚠️  Webhook signature verification failed.');

    return new Response(undefined, { status: 400 });
  }

  if (event.type == 'charge.succeeded') {
    const charge = event.data.object;
    // TODO: fulfill the order
    console.log(`✅ Charge succeeded`);
  }

  return new Response(undefined);
};
