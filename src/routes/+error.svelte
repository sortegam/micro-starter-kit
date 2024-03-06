<script>
  import Logo from '$lib/components/Logo/Logo.svelte';
  import { Button } from '$lib/components/Button';
</script>

<div class="flex justify-center items-center h-screen flex-col gap-2">
  <Logo />
  <div class="text-4xl block">404 Not Found</div>
  <div class="text-sm block text-red-300">
    The page you are looking is not here
  </div>
  <a href="/" rel="external">
    <Button class="mt-10">Go back home</Button>
  </a>
</div>
