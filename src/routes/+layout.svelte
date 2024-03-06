<script lang="ts">
  // We need to load this on every page to make sure the Stripe JS is loaded
  // and can detect weird behaviors and frauds.
  // More info: https://github.com/stripe/stripe-js#ensuring-stripejs-is-available-everywhere
  import '@stripe/stripe-js';
  import '../app.css';
  import { getFlash } from 'sveltekit-flash-message';
  import { page } from '$app/stores';
  import toast, { Toaster } from 'svelte-french-toast';
  import { PUBLIC_PROJECT_NAME } from '$env/static/public';
  import { MetaTags } from 'svelte-meta-tags';
  import { dev } from '$app/environment';

  const flash = getFlash(page);

  $: if ($flash) {
    switch ($flash.type) {
      case 'success':
        toast.success($flash.message, {
          position: 'bottom-center',
        });
        break;
      case 'error':
        toast.error($flash.message, {
          position: 'bottom-center',
          duration: 5000,
        });
    }
  }
</script>

<MetaTags
  title={PUBLIC_PROJECT_NAME}
  description="Boost your productivity with this SvelteKit-based boilerplate. Start
online projects faster, save time!"
/>
<Toaster />

{#if dev && !/^\/dev/.test($page.route.id ?? '')}
  <a
    href="/dev"
    class="text-[10px] font-bold fixed rounded-t-md text-black bg-orange-300 px-2 rotate-90
  left-[-23px] top-8"
  >
    Dev Zone
  </a>
{/if}

<slot />
