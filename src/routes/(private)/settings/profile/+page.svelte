<script lang="ts">
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { superForm } from 'sveltekit-superforms/client';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  import { profileSchema } from './profile.schema';
  import { cn } from '$lib/utils/ui-utils';
  import SettingsHeader from '../_components/SettingsHeader.svelte';
  import { Button } from '$lib/components/Button';
  import { valibot } from 'sveltekit-superforms/adapters';

  export let data: PageData;
  let profileForm: HTMLFormElement;

  const handleUpdateProfile = async () => {
    profileForm.requestSubmit();
  };

  const { form, enhance, errors } = superForm(data.profileForm, {
    validationMethod: 'auto',
    autoFocusOnError: true,
    resetForm: true,
    validators: valibot(profileSchema),
  });
</script>

<form method="POST" use:enhance bind:this={profileForm}>
  <SettingsHeader
    title="Profile"
    description="This is how others will see you on the site."
  />
  <div class="grid gap-5">
    <div class="grid gap-3 relative">
      <Label for="username">
        Username <small class="text-secondary float-right">
          (This will be your public display name)
        </small>
      </Label>
      <Input
        id="username"
        type="text"
        name="username"
        class={cn({ 'border-orange-600': $errors.username })}
        bind:value={$form.username}
      />
      {#if $errors.username}
        <small in:fade out:fade class="text-orange-600">
          {$errors.username?.[0]}
        </small>
      {/if}
    </div>
    <div class="grid gap-3 relative">
      <Label for="email">
        Email <small class="text-secondary float-right">
          (This will be your public display name)
        </small>
      </Label>
      <Input
        id="email"
        type="text"
        name="email"
        class={cn({ 'border-orange-600': $errors.email })}
        bind:value={$form.email}
      />
      {#if $errors.email}
        <small in:fade out:fade class="text-orange-600">
          {$errors.email?.[0]}
        </small>
      {/if}
    </div>
    <Button class="max-w-max" on:click={handleUpdateProfile}>
      Update profile
    </Button>
  </div>
</form>
