<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { superForm } from 'sveltekit-superforms/client';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  import CodeInput from '$lib/components/CodeInput/CodeInput.svelte';
  import { IconLoading } from '$lib/components/IconLoading';
  import { getFlash } from 'sveltekit-flash-message';
  import { isEmpty } from 'lodash';
  import { loginCheckEmailSchema } from '../loginCheckEmail.schema';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { verificationCodeLength } from '$config';
  import * as v from 'valibot';

  const flash = getFlash(page);
  let verificationCodeForm: HTMLFormElement;

  export let data: PageData;

  const { enhance, errors, submitting } = superForm(data.loginForm, {
    validationMethod: 'oninput',
  });

  let email: string | null = null;
  let emailValidation = false;

  if (browser) {
    email = window.sessionStorage.getItem('xsk:loginEmail');
    ({ success: emailValidation } = v.safeParse(loginCheckEmailSchema, {
      email,
    }));
    if (!emailValidation) {
      $flash = {
        type: 'error',
        message: 'Error on Code validation page',
      };
      goto('/login');
    }
  }

  function handleCodeSubmit() {
    verificationCodeForm.requestSubmit();
  }
</script>

<div in:fade>
  <form method="POST" bind:this={verificationCodeForm} use:enhance>
    <input type="hidden" name="email" value={email} />
    <Card.Root class="max-w-sm">
      <Card.Header class="space-y-1">
        <Card.Title class="text-2xl mb-4">
          Enter verification code 🔐
        </Card.Title>
        <Card.Description>
          <p>
            Check your inbox at <b>{email}</b>
            a verification code was sent to proceed. Remember to check your Spam
            folder.
          </p>
          <div class="mt-4 text-center min-h-20">
            {#if $submitting}
              <div class="text-center">
                <IconLoading class="h-12 w-12 text-primary inline-block" />
              </div>
            {:else}
              <CodeInput
                autoFocus
                on:complete={handleCodeSubmit}
                length={verificationCodeLength}
              />
            {/if}
          </div>
          {#if !isEmpty($errors)}
            <div class="px-8 pt-4 text-red-600">The code is not valid</div>
          {/if}
        </Card.Description>
      </Card.Header>
    </Card.Root>
  </form>
</div>
