<script lang="ts">
  import { cn } from '$lib/utils/ui-utils';
  import IconLoading from '~icons/tabler/refresh';
  let className: string = '';
  export { className as class };
</script>

<IconLoading class={cn('animate-spin direction-reverse', className)} />
