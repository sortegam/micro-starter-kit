<script lang="ts">
  import { page } from '$app/stores';
  import { cn } from '$lib/utils/ui-utils';

  let className: string | undefined | null = undefined;
  export { className as class };

  const options = [{ label: 'Dashboard', path: '/dashboard/' }];
</script>

<nav class={cn('flex items-center space-x-4 lg:space-x-6', className)}>
  {#each options as option}
    {@const matchingPath = new RegExp(
      `^${option.path.replace('/', '\\/')}.*`
    ).test($page.url.pathname)}
    <a
      href={option.path}
      class={cn('text-sm font-medium transition-colors hover:text-primary', {
        'text-muted-foreground': !matchingPath,
      })}
    >
      {option.label}
    </a>
  {/each}
</nav>
