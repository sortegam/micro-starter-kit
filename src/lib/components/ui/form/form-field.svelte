<script lang="ts" context="module">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { FormPath, SuperForm } from "sveltekit-superforms";
	type T = Record<string, unknown>;
	type U = unknown;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import type { HTMLAttributes } from "svelte/elements";
	import * as FormPrimitive from "formsnap";
	import { cn } from "$lib/utils/ui-utils";

	type $$Props = FormPrimitive.FieldProps<T, U> & HTMLAttributes<HTMLElement>;

	export let form: SuperForm<T>;
	export let name: U;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<FormPrimitive.Field {form} {name} let:constraints let:errors let:tainted let:value>
	<div class={cn("space-y-2", className)}>
		<slot {constraints} {errors} {tainted} {value} />
	</div>
</FormPrimitive.Field>
