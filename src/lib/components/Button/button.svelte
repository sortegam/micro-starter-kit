<script lang="ts">
  import { cn } from '$lib/utils/ui-utils';
  import type { ComponentType } from 'svelte';
  import { slide } from 'svelte/transition';
  import { tv } from 'tailwind-variants';
  import IconLoading from '~icons/tabler/refresh';
  import { Button, type Props } from '../ui/button';

  // #################################################################
  // # Types
  // #################################################################

  type $$Props = Props & {
    loading?: boolean;
    Icon?: ComponentType;
  };

  // #################################################################
  // # Component
  // #################################################################

  const iconVariants = tv({
    base: 'mr-2',
    variants: {
      size: {
        default: 'h-4 w-4',
        sm: 'h-4 w-4',
        lg: 'h-5 w-5',
        icon: 'h-5 w-5 mr-0',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  });

  export let loading = false;
  export let Icon: ComponentType | null = null;
  export let size: Props['size'] = 'default';
</script>

<Button disabled={loading} {size} {...$$restProps} on:click on:keydown>
  {#if loading}
    <span in:slide={{ axis: 'x' }} out:slide={{ axis: 'x' }}>
      <IconLoading
        class={cn('animate-spin direction-reverse', iconVariants({ size }))}
      />
    </span>
  {:else if Icon}
    <svelte:component this={Icon} class={cn(iconVariants({ size }))} />
  {/if}
  <slot />
</Button>
