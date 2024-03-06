<script lang="ts">
  // We need to load this on every page to make sure the Stripe JS is loaded
  // and can detect weird behaviors and frauds.
  // More info: https://github.com/stripe/stripe-js#ensuring-stripejs-is-available-everywhere
  import '@stripe/stripe-js';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/Button';
  import { PUBLIC_PROJECT_NAME } from '$env/static/public';
  import * as HoverCard from '$lib/components/ui/hover-card';
</script>

<h1 class="text-2xl mb-6 font-bold">{PUBLIC_PROJECT_NAME} Dashboard</h1>

<div class="grid gap-1 grid-flow-col grid-cols-3">
  <Card.Root class="max-w-sm transform hover:scale-105 transition duration-300">
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl mb-4">Settings</Card.Title>
      <Card.Description>
        Visit the SaaS settings page and change your preferences.
      </Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4 bottom-0 absolute w-full mt-4">
      <Button href="/settings/">Go Settings</Button>
    </Card.Content>
  </Card.Root>

  <Card.Root
    class="max-w-sm transform hover:scale-105 hover:border-w transition duration-300"
  >
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl mb-4">Stripe</Card.Title>
      <Card.Description>
        These are Stripe integration examples:
      </Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4 mt-4">
      <HoverCard.Root openDelay={200}>
        <HoverCard.Trigger>
          <Button href="/pay/checkout-stripe-elements/" class="w-full">
            Pay 10 Eur (Stripe Web Elements)
          </Button>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <p>
            This is a simple example of a Stripe Checkout integration using
            Stripe Web Elements (Payment form is hosted with Iframed Inputs)
          </p>
        </HoverCard.Content>
      </HoverCard.Root>
      <HoverCard.Root openDelay={200}>
        <HoverCard.Trigger>
          <Button href="/pay/stripe-checkout/" class="w-full">
            Pay 19 Eur (Stripe Checkout)
          </Button>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <p>
            This is a simple example of a Stripe Checkout integration using
            Stripe Checkout (Payment form is hosted by Stripe)
          </p>
        </HoverCard.Content>
      </HoverCard.Root>
      <HoverCard.Root openDelay={200}>
        <HoverCard.Trigger>
          <Button href="/pay/stripe-subscribe/" class="w-full">
            Subscribe 9 Eur/month
          </Button>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <p>
            This is a simple example of a Stripe Checkout integration using
            Stripe Checkout (Payment form is hosted by Stripe)
          </p>
        </HoverCard.Content>
      </HoverCard.Root>
    </Card.Content>
  </Card.Root>

  <Card.Root class="max-w-sm transform hover:scale-105 transition duration-300">
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl mb-4">Demo</Card.Title>
      <Card.Description>
        Check out the demo page with some examples.
      </Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4 bottom-0 absolute w-full mt-4">
      <Button href="/demo/">Go Demo Section</Button>
    </Card.Content>
  </Card.Root>
</div>
