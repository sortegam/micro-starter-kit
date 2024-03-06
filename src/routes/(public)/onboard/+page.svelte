<script lang="ts">
  import { Button } from '$lib/components/Button';
  import * as Card from '$lib/components/ui/card';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { superForm } from 'sveltekit-superforms/client';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  import { onboardSchema } from './onboard.schema';
  import IconCheck from '~icons/tabler/check';
  import IconUserNameTaken from '~icons/tabler/alert-triangle';
  import debounce from 'lodash/debounce';
  import { ERROR_MESSAGE_USERNAME_TAKEN } from './constants';
  import { cn } from '$lib/utils/ui-utils';
  import { valibot } from 'sveltekit-superforms/adapters';

  export let data: PageData;
  let onboardForm: HTMLFormElement;
  // We will know that initially the username is available
  // because the initial load of the form will propose a name
  // that is available, otherwise will return empty string
  let usernameAvailable = Boolean(data.onboardForm.data.username);
  $: canSubmitForm =
    !$errors.username && $form.username && !$submitting && usernameAvailable;

  const { form, enhance, submitting, validateForm, errors } = superForm(
    data.onboardForm,
    {
      validationMethod: 'auto',
      autoFocusOnError: true,
      // defaultValidator: 'clean',
      resetForm: true,
      validators: valibot(onboardSchema),
    }
  );

  async function isFormValid() {
    usernameAvailable = false;
    const validatedForm = await validateForm();
    return validatedForm.valid;
  }

  async function handleContinue() {
    if (!canSubmitForm || !(await isFormValid())) {
      return;
    }

    onboardForm.requestSubmit();
  }

  async function checkUserNameAvailability(ev: InputEvent) {
    if (!(await isFormValid())) {
      return;
    }
    const username = (ev.target as HTMLInputElement).value;

    // Check if username is available
    const response = await fetch('/onboard/user-available', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
    const { available } = await response.json();
    if (!available) {
      usernameAvailable = false;
      $errors.username = [ERROR_MESSAGE_USERNAME_TAKEN];
    } else {
      usernameAvailable = true;
    }
  }

  const debouncedCheckUserNameAvailability = debounce(
    checkUserNameAvailability,
    500
  );
</script>

<form method="POST" use:enhance bind:this={onboardForm}>
  <Card.Root>
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl mb-4">Account creation</Card.Title>
      <Card.Description>Choose an username for your account.</Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t" />
        </div>
      </div>
      <div class="grid gap-3 relative">
        <Label for="username">
          Username <small class="text-secondary float-right">
            (This will be your public display name)
          </small>
        </Label>
        {#if usernameAvailable && !$submitting}
          <div
            in:fade
            out:fade
            class="absolute font-bold text-xs text-green-600 right-3 top-9 flex gap-1"
          >
            <IconCheck /> Available
          </div>
        {:else if !$submitting && $errors.username && $errors.username?.[0] === ERROR_MESSAGE_USERNAME_TAKEN}
          <div
            in:fade
            out:fade
            class="absolute font-bold text-xs text-orange-600 right-3 top-9 flex gap-1"
          >
            <IconUserNameTaken /> Username taken!
          </div>
        {/if}
        <Input
          id="username"
          type="text"
          name="username"
          class={cn({ 'border-orange-600': $errors.username })}
          on:input={(ev) => {
            canSubmitForm = false;
            debouncedCheckUserNameAvailability(ev);
            if (ev.data === 'Enter') {
              handleContinue();
            }
          }}
          bind:value={$form.username}
        />
        {#if $errors.username && $errors.username?.[0] !== ERROR_MESSAGE_USERNAME_TAKEN}
          <small in:fade out:fade class="text-orange-600">
            {$errors.username?.[0]}
          </small>
        {/if}
      </div>
      <Button
        type="button"
        loading={$submitting}
        class="w-full"
        disabled={!canSubmitForm}
        on:click={handleContinue}
      >
        Continue
      </Button>
    </Card.Content>
  </Card.Root>
</form>
