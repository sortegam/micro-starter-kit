<script lang="ts">
  import { cn } from '$lib/utils/ui-utils';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/Button';
  import { settingsItems } from '../settings.config';
  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<nav class={cn('flex flex-col space-x-0 space-y-1', className)}>
  {#each settingsItems as item}
    <Button
      href={item.path}
      variant="ghost"
      Icon={item.icon}
      class={cn(
        $page.url.pathname === item.path
          ? 'bg-muted hover:bg-muted'
          : 'hover:bg-transparent hover:underline',
        'justify-start'
      )}
    >
      {item.title}
    </Button>
  {/each}
</nav>
