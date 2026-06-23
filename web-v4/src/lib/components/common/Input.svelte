<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const inputVariants = tv({
		base: 'w-full px-3 h-8 text-sm rounded-md border border-ink-200 bg-canvas text-ink-900 transition-[border-color] duration-100 ease-out-expo placeholder:text-ink-400 disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-negative focus:border-focus-ring focus:outline-none',
		variants: {
			size: {
				sm: 'h-6 px-2 rounded-sm text-xs',
				md: '',
				lg: 'h-10 px-4 text-base'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	});

	export type InputSize = VariantProps<typeof inputVariants>['size'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { getContext } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type FieldContext = {
		id: string;
		name: string;
		describedBy?: string;
		invalid: boolean;
		required: boolean;
	};

	type Props = Omit<HTMLInputAttributes, 'size'> & {
		size?: InputSize;
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
	let classes = $derived(cn(inputVariants({ size }), className));
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
	oninput={(e) => value = (e.target as HTMLInputElement).value}
	{...rest}
/>
