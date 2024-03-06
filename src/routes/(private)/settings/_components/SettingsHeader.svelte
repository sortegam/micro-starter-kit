<script>
  import { Separator } from '$lib/components/ui/separator';

  export let title = '';
  export let description = '';
</script>

<h3 class="text-xl font-bold">{title}</h3>
<p class="text-sm text-muted-foreground">
  {description}
</p>
<Separator class="my-6" />
