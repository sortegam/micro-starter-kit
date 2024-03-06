<script lang="ts">
  // We need to load this
  import '@stripe/stripe-js';
  import MainNav from './_components/TopNav.svelte';
  import UserNav from './_components/ContextualUserNav.svelte';
  import type { LayoutData } from './$types';
  import { user } from '$lib/client/stores/userStore';
  import { browser } from '$app/environment';

  export let data: LayoutData;

  $: user.set(data.user);

  // Setup theme
  if (browser) {
    if (!data.userSettings?.appearanceDarkTheme) {
      document.documentElement.classList.remove('dark');
    }
  }
</script>

<div class="flex-col flex">
  <div class="border-b">
    <div class="container flex h-16 items-center px-4">
      <MainNav class="mx-6" />
      <div class="ml-auto flex items-center space-x-4">
        <UserNav />
      </div>
    </div>
  </div>
  <div class="container space-y-4 p-8 pt-6">
    <slot />
  </div>
</div>
