<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const textareaVariants = tv({
		base: 'w-full rounded-md border border-ink-200 bg-canvas text-ink-900 transition-shadow transition-colors duration-100 ease-out-expo placeholder:text-ink-400 disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-negative focus-visible:border-focus-ring focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-0 resize-none',
		variants: {
			variant: {
				outline: '',
				filled: 'border-0 bg-ink-100 focus:bg-ink-50'
			},
			size: {
				sm: 'text-base rounded-sm',
				md: 'text-base',
				lg: 'text-base'
			}
		},
		defaultVariants: {
			size: 'md',
			variant: 'outline'
		}
	});

	export type TextareaVariant = VariantProps<typeof textareaVariants>['variant'];
	export type TextareaSize = VariantProps<typeof textareaVariants>['size'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { getContext } from 'svelte';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type FieldContext = {
		id: string;
		name: string;
		describedBy?: string;
		invalid: boolean;
		required: boolean;
	};

	type Props = Omit<HTMLTextareaAttributes, 'size'> & {
		variant?: TextareaVariant;
		size?: TextareaSize;
		class?: string;
	};

	let field = getContext<FieldContext | undefined>('field');

	let {
		variant,
		size,
		name,
		value = $bindable(),
		placeholder,
		required,
		disabled,
		readonly,
		rows,
		class: className,
		...rest
	}: Props = $props();

	let resolvedName = $derived(name ?? field?.name);
	let resolvedId = $derived(field?.id);
	let resolvedRequired = $derived(required ?? field?.required);
	let ariaDescribedBy = $derived(field?.describedBy);
	let ariaInvalid = $derived(field?.invalid || undefined);
	let classes = $derived(cn(textareaVariants({ variant, size }), className));
</script>

<div class="grid {classes}" data-replicated-value={value}>
	<textarea
		id={resolvedId}
		name={resolvedName}
		{value}
		{placeholder}
		{rows}
		required={resolvedRequired}
		{disabled}
		{readonly}
		aria-describedby={ariaDescribedBy}
		aria-invalid={ariaInvalid}
		oninput={(e) => value = (e.target as HTMLTextAreaElement).value}
		{...rest}
	></textarea>
</div>

<style>
	div {
		position: relative;
	}

	div::after {
		content: attr(data-replicated-value) ' ';
		white-space: pre-wrap;
		visibility: hidden;
		grid-area: 1 / 1;
		word-wrap: break-word;
	}

	div :global(textarea) {
		grid-area: 1 / 1;
	}

	div::after,
	div :global(textarea) {
		padding: 0.5rem 0.75rem;
		line-height: 1.5;
	}

	div :global(textarea) {
		background: transparent;
	}
</style>
