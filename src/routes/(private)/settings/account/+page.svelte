<script lang="ts">
  import { Button } from '$lib/components/Button';
  import SettingsHeader from '../_components/SettingsHeader.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Input } from '$lib/components/ui/input';
  import { user } from '$lib/client/stores/userStore';
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';

  export let data: PageData;
  let accountForm: HTMLFormElement;
  let isDialogOpen = false;

  const { form, enhance, submitting } = superForm(data.accountForm, {
    validationMethod: 'oninput',
    autoFocusOnError: true,
    taintedMessage: null,
    resetForm: false,
    dataType: 'json',
  });

  async function handleDeleteAccount() {
    accountForm.requestSubmit();
  }

  $: canSubmitForm = $form.username === $user?.username && !$submitting;
</script>

<SettingsHeader title="Account" description="Manage your account" />
<div class="text-xl text-red-500 font-bold mb-2">Delete account</div>
<p class="mb-4">
  Warning: This action is irreversible. It will permanently erase your account
  from the platform. Please double-check your decision before proceeding by
  clicking the button below.
</p>

<Button
  type="button"
  variant="destructive"
  class="max-w-max"
  on:click={() => {
    isDialogOpen = true;
  }}
>
  Delete your account
</Button>

<!--
// #################################################################
// # Confirmation Dialog
// #################################################################
-->

<Dialog.Root bind:open={isDialogOpen}>
  <Dialog.Content class="sm:max-w-[425px]">
    <form method="POST" use:enhance bind:this={accountForm}>
      <Dialog.Header>
        <Dialog.Title>Account delete</Dialog.Title>
        <Dialog.Description>
          This action is irreversible. It will permanently erase your account
          from the platform.
        </Dialog.Description>
      </Dialog.Header>
      <Input
        on:paste={(e) => {
          e.preventDefault();
        }}
        type="text"
        bind:value={$form.username}
        id="username"
        name="username"
        placeholder="To confirm, type your username"
        class="my-6"
      />
      <Dialog.Footer>
        {#if !$submitting}
          <Button
            type="button"
            variant="outline"
            on:click={() => {
              isDialogOpen = false;
            }}
          >
            Cancel
          </Button>
        {/if}

        <Button
          loading={$submitting}
          type="submit"
          variant="destructive"
          disabled={!canSubmitForm}
          on:click={handleDeleteAccount}
        >
          I confirm my account removal
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
