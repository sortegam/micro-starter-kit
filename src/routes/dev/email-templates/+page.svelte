<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/Button';
  import * as Card from '$lib/components/ui/card';
  import type { PageData } from './$types';
  import IconTemplate from '~icons/tabler/file-code';
  export let data: PageData;

  let activeTemplate: string | null = null;

  if (browser) {
    const hash = window.location.hash;
    if (hash) {
      activeTemplate = hash.slice(1);
    }
  }
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
  <Card.Root class="col-span-2">
    <Card.Header>
      <Card.Title>Available Email Templates</Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col gap-2">
      {#each data.templateList as template}
        <Button
          Icon={IconTemplate}
          variant={template === activeTemplate ? 'default' : 'link'}
          on:click={() => {
            activeTemplate = template;
            goto(`/dev/email-templates#${template}`);
          }}
        >
          {template}
        </Button>
      {/each}
    </Card.Content>
  </Card.Root>
  <Card.Root class="col-span-6">
    <Card.Header>
      <Card.Title>Preview</Card.Title>
    </Card.Header>
    <Card.Content>
      {#if activeTemplate}
        <iframe
          title="Email Preview"
          src="/dev/email-templates/{activeTemplate}"
          class="w-full h-96 bg-white rounded-lg"
          frameborder="0"
          allowfullscreen
        />
      {:else}
        <IconTemplate class="w-24 h-24 mx-auto text-gray-300" />
      {/if}
    </Card.Content>
  </Card.Root>
</div>
