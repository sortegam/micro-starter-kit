<script lang="ts">
  import DevMainNav from './_components/dev-main-nav.svelte';
</script>

<div class="hidden flex-col md:flex">
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <DevMainNav class="mx-6" />
    </div>
  </div>
  <div class="flex-1 space-y-4 p-8 pt-6">
    <slot />
  </div>
</div>
