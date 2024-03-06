<script lang="ts">
  // NOTE: To set appearance attrib on Stripe Elements Check this out.
  // https://stripe.com/docs/elements/appearance-api
  import { goto } from '$app/navigation';
  import { Elements, PaymentElement } from 'svelte-stripe';
  import { loadStripe } from '$lib/client/stripe';
  import type { Stripe, StripeElements, StripeError } from '@stripe/stripe-js';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { Button } from '$lib/components/Button';
  import { IconLoading } from '$lib/components/IconLoading';

  let error: StripeError | Error | null = null;
  let stripe: Stripe | null;
  let elements: StripeElements;
  let processing = false;
  export let data: PageData;

  $: error = data.error ? new Error(data.error) : null;

  onMount(async () => {
    stripe = await loadStripe();
  });

  async function submit() {
    // avoid processing duplicates
    if (processing) return;

    processing = true;

    // confirm payment with stripe
    const result = await stripe?.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (result?.error) {
      // payment failed, notify user
      error = result?.error ?? new Error('Unknown Stripe error.');
      processing = false;
    } else {
      // payment succeeded, redirect to "thank you" page
      goto('/pay/thank-you');
    }
  }
</script>

<h1 class="text-xl">
  Pay <span class="text-primary">$10 USD</span>
  with Stripe Checkout Elements
</h1>

{#if error}
  <p class="text-red-400 py-4">{error.message}. Please try again.</p>
{:else if stripe && data.clientSecret}
  <Elements
    {stripe}
    clientSecret={data.clientSecret}
    theme="night"
    labels="floating"
    variables={{ colorPrimary: '#22C55E' }}
    rules={{ '.Input': { border: 'solid 2px #0002', padding: '2px 10px' } }}
    bind:elements
  >
    <form on:submit|preventDefault={submit} class="flex flex-col gap-2 my-8">
      <PaymentElement options={{}} />

      <Button
        disabled={processing}
        loading={processing}
        class="b bg-primary mt-2 p-7 rounded-lg text-xl font-bold"
      >
        {#if processing}
          Processing...
        {:else}
          Pay $10 USD
        {/if}
      </Button>
    </form>
  </Elements>
{:else}
  <div class="m-20 flex gap-2 items-center justify-center">
    <IconLoading />
    Loading...
  </div>
{/if}
