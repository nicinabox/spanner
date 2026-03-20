<script lang="ts">
	import { cn } from '$lib/utils';
	import { getFieldContext } from '$lib/utils/field.svelte';
	import FormField from './FormField.svelte';

	import type { ComponentProps } from 'svelte';

	type FormFieldProps = Omit<ComponentProps<typeof FormField>, 'children'>;
	type Props = FormFieldProps & {
		value?: boolean;
	};

	let {
		label,
		hint,
		errors,
		name,
		required,
		id,
		value = $bindable(false),
		attributes,
		class: className,
		...props
	}: Props = $props();

	const ctx = getFieldContext();

	let checked = $derived(value);
</script>

<FormField
	{label}
	{hint}
	{errors}
	{required}
	{id}
	{name}
	{...props}
	class={cn('grid min-w-0 grid-cols-[auto_1fr] gap-x-4', className)}
	attributes={{
		...attributes,
		hint: {
			class: 'text-sm whitespace-wrap'
		}
	}}
>
	<input type="hidden" name={ctx?.name} value={checked} />
	<label class="row-span-2 inline-flex cursor-pointer items-center self-center justify-self-end">
		<span class="switch-track">
			<input
				type="checkbox"
				id={ctx?.id}
				name={ctx?.name}
				aria-required={ctx?.required}
				aria-invalid={ctx?.invalid}
				disabled={ctx?.disabled}
				readonly={ctx?.readonly}
				bind:checked
				class="peer sr-only"
			/>
		</span>
	</label>
</FormField>
