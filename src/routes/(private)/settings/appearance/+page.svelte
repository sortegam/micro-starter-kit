<script lang="ts">
  import { browser } from '$app/environment';
  import { saveUserSettings } from '$lib/client/userSettings.helpers';
  import { Label } from '$lib/components/ui/label';
  import { Switch } from '$lib/components/ui/switch';
  import SettingsHeader from '../_components/SettingsHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let useDarkTheme = Boolean(data.userSettings?.appearanceDarkTheme);

  $: {
    if (useDarkTheme !== Boolean(data.userSettings?.appearanceDarkTheme)) {
      (async () => {
        try {
          await saveUserSettings({
            appearanceDarkTheme: useDarkTheme ? 1 : 0,
          });
          if (data.userSettings) {
            data.userSettings.appearanceDarkTheme = useDarkTheme ? 1 : 0;
          }
          if (browser) {
            if (!useDarkTheme) {
              document.documentElement.classList.remove('dark');
            } else {
              document.documentElement.classList.add('dark');
            }
          }
        } catch (error) {
          // Rollback value in client
          useDarkTheme = Boolean(data.userSettings?.appearanceDarkTheme);
        }
      })();
    }
  }
</script>

<SettingsHeader
  title="Appearance"
  description="Change how the site looks and feels."
/>
<div class="grid gap-5">
  <div
    class="grid gap-3 relative p-2 border border-transparent hover:border-border rounded-md"
  >
    <Label for="dark-theme">
      Dark theme
      <small class="float-right">
        <Switch id="dark-theme" bind:checked={useDarkTheme} />
      </small>
    </Label>
  </div>
</div>
