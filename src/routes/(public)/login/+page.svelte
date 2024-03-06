<script lang="ts">
  import { Button } from '$lib/components/Button';
  import IconGoogle from '~icons/tabler/brand-google';
  import IconDiscord from '~icons/tabler/brand-discord-filled';
  import { page } from '$app/stores';
  import * as Card from '$lib/components/ui/card';
  import { goto } from '$app/navigation';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { superForm } from 'sveltekit-superforms/client';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  import { valibot } from 'sveltekit-superforms/adapters';
  import { loginCheckEmailSchema } from './loginCheckEmail.schema';
  import { browser } from '$app/environment';

  let loading = false;

  export let data: PageData;

  const reload = $page.url.searchParams.get('reload');

  // This might sound stupid, but its needed for discord login to work.
  if (reload && browser) {
    window.location.reload();
  }

  const { form, enhance, submitting, validateForm, errors } = superForm(
    data.loginForm,
    {
      validationMethod: 'auto',
      autoFocusOnError: true,
      taintedMessage: null,
      resetForm: false,
      validators: valibot(loginCheckEmailSchema),
    }
  );
  let emailLoginForm: HTMLFormElement;

  function handleLoginWithGoogle() {
    loading = true;
    goto('/login/google');
  }
  function handleLoginWithDiscord() {
    loading = true;
    goto('/login/discord');
  }
  async function handleLoginWithEmail() {
    const validatedForm = await validateForm();
    if (!validatedForm.valid) {
      return;
    }

    // We put this into session storage for using it in the next step.
    window.sessionStorage.setItem('xsk:loginEmail', $form.email.toLowerCase());
    emailLoginForm.requestSubmit();
  }
</script>

<form method="POST" use:enhance bind:this={emailLoginForm}>
  <Card.Root class="max-w-sm">
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl mb-4">Login / Sign up method</Card.Title>
      <Card.Description>
        We don't store passwords. We have Social Auth and custom Magic Link
        integrations.
      </Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4">
      <div class="grid grid-cols-2 gap-6">
        <Button
          on:click={handleLoginWithDiscord}
          loading={loading || $submitting}
          Icon={IconDiscord}
          type="button"
        >
          Discord
        </Button>
        <Button
          on:click={handleLoginWithGoogle}
          loading={loading || $submitting}
          Icon={IconGoogle}
          type="button"
        >
          Google
        </Button>
      </div>
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input
          id="email"
          type="text"
          name="email"
          class={$errors.email ? 'border-orange-600' : ''}
          placeholder="your@email.com"
          on:keypress={(e) => {
            if (e.key === 'Enter') {
              handleLoginWithEmail();
            }
          }}
          bind:value={$form.email}
        />
        {#if $errors.email}
          <small in:fade out:fade class="text-orange-600">
            {$errors.email}
          </small>
        {/if}
      </div>
      <Button
        type="button"
        loading={$submitting}
        class="w-full"
        disabled={!$form.email || $submitting || loading}
        on:click={handleLoginWithEmail}
      >
        Continue
      </Button>
    </Card.Content>

    <Card.Footer>
      <p class="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{' '}
        <a
          href="/terms"
          class="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>
        {' '}
        and{' '}
        <a
          href="/privacy"
          class="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </p>
    </Card.Footer>
  </Card.Root>
</form>
