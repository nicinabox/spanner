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
	let classes = $derived(cn(inputVariants({ variant, size }), 'appearance-none pr-8', className));
	let bgImage = $derived(
		variant === 'filled'
			? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")"
			: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
	);
</script>

<select
	id={resolvedId}
	name={resolvedName}
	bind:value
	required={resolvedRequired}
	{disabled}
	class={classes}
	style="background-image: {bgImage}; background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 16px"
	aria-describedby={ariaDescribedBy}
	aria-invalid={ariaInvalid}
	{...rest}
>
	{#each options as opt}
		<option value={opt.value}>{opt.label}</option>
	{/each}
</select>
