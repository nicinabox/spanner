<script lang="ts">
	import { getContext } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type FieldContext = {
		id: string;
		name: string;
		describedBy?: string;
		invalid: boolean;
		required: boolean;
	};

	type Size = 'sm' | 'lg';

	type Props = Omit<HTMLInputAttributes, 'size'> & {
		size?: Size;
		class?: string;
	};

	let field = getContext<FieldContext | undefined>('field');

	let {
		size,
		name,
		type = 'text',
		value = $bindable(),
		placeholder,
		required,
		disabled,
		readonly,
		autocomplete,
		inputmode,
		pattern,
		class: className,
		...rest
	}: Props = $props();

	let resolvedName = $derived(name ?? field?.name);
	let resolvedId = $derived(field?.id);
	let resolvedRequired = $derived(required ?? field?.required);
	let ariaDescribedBy = $derived(field?.describedBy);
	let ariaInvalid = $derived(field?.invalid || undefined);
	let classes = $derived(
		[
			'w-full px-3 py-2 h-8 text-sm rounded-md border border-ink-200 bg-canvas text-ink-900 transition-[border-color] duration-100 ease-out-expo placeholder:text-ink-400 disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-negative focus:border-focus-ring focus:outline-none',
			size === 'sm' && 'h-6 px-2 py-1 rounded-sm text-xs',
			size === 'lg' && 'h-10 px-4 py-3 text-base',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<input
	id={resolvedId}
	name={resolvedName}
	{type}
	{value}
	{placeholder}
	required={resolvedRequired}
	{disabled}
	{readonly}
	{autocomplete}
	{inputmode}
	{pattern}
	class={classes}
	aria-describedby={ariaDescribedBy}
	aria-invalid={ariaInvalid}
	{...rest}
/>