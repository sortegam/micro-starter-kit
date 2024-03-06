<script lang="ts">
  import { enhance } from '$app/forms';
  import { IconLoading } from '$lib/components/IconLoading';
  import { onMount } from 'svelte';

  let processPaymentForm: HTMLFormElement;

  onMount(() => {
    processPaymentForm.requestSubmit();
  });
</script>

<div class="m-20 flex gap-2 items-center justify-center">
  <IconLoading />
  Redirecting to Stripe Checkout...
</div>

<form method="POST" bind:this={processPaymentForm} use:enhance></form>
