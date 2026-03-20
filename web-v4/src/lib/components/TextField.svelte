<script lang="ts">
	import FormField from './FormField.svelte';
	import Input from './ui/Input.svelte';
	import type { ComponentProps } from 'svelte';

	type FormFieldProps = Omit<ComponentProps<typeof FormField>, 'children'>;
	type InputProps = ComponentProps<typeof Input>;
	type Props = FormFieldProps & InputProps;

	let {
		label,
		hint,
		errors,
		name,
		required,
		id,
		type = 'text',
		value = $bindable(''),
		attributes,
		class: className,
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
	<Input {type} bind:value />
</FormField>
