<script lang="ts">
	import FormField from './FormField.svelte';
	import NativeSelect from './ui/NativeSelect.svelte';
	import type { ComponentProps } from 'svelte';

	type FormFieldProps = Omit<ComponentProps<typeof FormField>, 'children'>;
	type SelectProps = ComponentProps<typeof NativeSelect>;
	type Props = FormFieldProps &
		SelectProps & {
			options: { value: string; label: string }[];
		};

	let {
		label,
		hint,
		errors,
		name,
		required,
		id,
		value = $bindable(''),
		attributes,
		class: className,
		options,
		...props
	}: Props = $props();
</script>

<FormField
	class={className}
	{attributes}
	{label}
	{hint}
	{errors}
	{required}
	{id}
	{name}
	{...props}
>
	<NativeSelect bind:value>
		{#each options as { value, label }, i (i)}
			<option {value}>{label}</option>
		{/each}
	</NativeSelect>
</FormField>
