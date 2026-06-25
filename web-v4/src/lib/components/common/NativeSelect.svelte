<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { inputVariants, type InputSize, type InputVariant } from './Input.svelte';
	import { getContext } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	type FieldContext = {
		id: string;
		name: string;
		describedBy?: string;
		invalid: boolean;
		required: boolean;
	};

	type Option = { value: string; label: string };

	type Props = Omit<HTMLSelectAttributes, 'size'> & {
		variant?: InputVariant;
		size?: InputSize;
		options: Option[];
		class?: string;
	};

	let field = getContext<FieldContext | undefined>('field');

	let {
		variant,
		size,
		name,
		value = $bindable(),
		required,
		disabled,
		options,
		class: className,
		...rest
	}: Props = $props();

	let resolvedName = $derived(name ?? field?.name);
	let resolvedId = $derived(field?.id);
	let resolvedRequired = $derived(required ?? field?.required);
	let ariaDescribedBy = $derived(field?.describedBy);
	let ariaInvalid = $derived(field?.invalid || undefined);
	let classes = $derived(cn(inputVariants({ variant, size }), className));
</script>

<select
	id={resolvedId}
	name={resolvedName}
	{value}
	required={resolvedRequired}
	{disabled}
	class={classes}
	aria-describedby={ariaDescribedBy}
	aria-invalid={ariaInvalid}
	{...rest}
>
	{#each options as opt}
		<option value={opt.value}>{opt.label}</option>
	{/each}
</select>
