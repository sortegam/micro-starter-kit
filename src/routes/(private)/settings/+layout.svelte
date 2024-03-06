<script lang="ts">
  import SettingsSidebarNav from './_components/SettingsSidebarNav.svelte';
</script>

<div class="space-y-0.5">
  <h2 class="text-2xl font-bold tracking-tight">Settings</h2>
  <p class="text-muted-foreground">
    Manage your account settings and set e-mail preferences.
  </p>
</div>

<div class="max-w-4xl p-4">
  <div class="flex flex-row">
    <aside class="-mx-4 min-w-[250px]">
      <SettingsSidebarNav />
    </aside>
    <div class="flex-1 ml-10">
      <slot />
    </div>
  </div>
</div>
