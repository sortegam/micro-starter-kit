<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils/ui-utils";

	type $$Props = MenubarPrimitive.Props;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<MenubarPrimitive.Root
	class={cn(
		"flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
		className
	)}
>
	<slot />
</MenubarPrimitive.Root>
