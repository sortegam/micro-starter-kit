<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { CodeCompleteEventPayload } from './CodeInput.types';
  import { range } from 'lodash';

  let codeArray: string[] = [];
  export let length = 5;
  export let disabled = false;
  export let autoFocus = false;

  $: code = codeArray.join('');

  //                                                code
  const dispatch = createEventDispatcher<CodeCompleteEventPayload>();

  onMount(async () => {
    if (autoFocus) {
      // Hack I need to use timeout and getElementById because some race conditions
      setTimeout(() => {
        document.getElementById('code-input-0')?.focus();
      }, 500);
    }
  });

  $: {
    if (code.length === length) {
      disabled = true;
      dispatch('complete', { code });
    }
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event?.clipboardData?.getData('text/plain');
    if (paste) {
      try {
        const pasteArray = paste.split('')?.slice(0, length);
        // Non svelte way of doing it... :( but it works!
        range(0, length).forEach((i) => {
          (
            document.getElementById(`code-input-${i}`) as HTMLInputElement
          ).value = pasteArray[i] || '';
        });
        // This is a hack to make it work... :(
        codeArray = pasteArray;
      } catch (error) {
        // do nothing
      }
    }
  }

  function handleInput(event: KeyboardEvent) {
    const inputEl = event.target as HTMLInputElement;
    const idx = Number(inputEl.id.split('-')[2]);

    if (event.key === 'Backspace') {
      if (idx > 0) {
        document.getElementById(`code-input-${idx - 1}`)?.focus();
      }
    } else {
      if (idx < length - 1 && inputEl.value.length === 1) {
        document.getElementById(`code-input-${idx + 1}`)?.focus();
      }
    }
  }
</script>

{#each Array.from({ length }, (_, i) => i) as i}
  <input
    class="input w-12 h-12 text-3xl text-center font-bold mx-1
    text-white inline-block"
    maxlength="1"
    name="code-input-{i}"
    id="code-input-{i}"
    type="text"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    tabindex={i}
    {disabled}
    bind:value={codeArray[i]}
    on:keyup={handleInput}
    on:paste={handlePaste}
  />
{/each}
