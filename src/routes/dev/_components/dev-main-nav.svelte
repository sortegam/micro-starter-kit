<script lang="ts">
  import { cn } from '$lib/utils/ui-utils';
  import IconArrowLeft from '~icons/tabler/arrow-left';

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<nav class={cn('flex items-center space-x-4 lg:space-x-6', className)}>
  <a
    href="/"
    class="text-sm font-medium text-muted-foreground transition-colors
  hover:text-primary"
  >
    <IconArrowLeft class="inline-block w-4 h-4 mr-1 -mt-1" />
    Back
  </a>
  <a
    href="/dev/email-templates"
    class="text-sm font-medium transition-colors hover:text-primary"
  >
    Email Templates
  </a>
</nav>
