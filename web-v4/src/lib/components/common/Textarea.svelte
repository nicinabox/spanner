<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const textareaVariants = tv({
		base: 'w-full rounded-md border border-ink-200 bg-canvas text-ink-900 transition duration-150 ease-in-out shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed not-focus-within:aria-invalid:border-negative focus-within:bg-ink-50 focus-within:border-focus-ring focus-within:outline-2 focus-within:outline-focus-ring focus-within:outline-offset-0 resize-none',
		variants: {
			variant: {
				outline: '',
				filled: 'border-0 bg-ink-200/60',
				plain:
					'border-0 bg-transparent shadow-none rounded-none h-auto px-0 focus-within:border-transparent focus-within:outline-0 focus-within:bg-transparent',
			},
			size: {
				sm: 'text-base rounded-sm',
				md: 'text-base',
				lg: 'text-base',
			},
		},
		defaultVariants: {
			size: 'md',
			variant: 'outline',
		},
	});

	export type TextareaVariant = VariantProps<typeof textareaVariants>['variant'];
	export type TextareaSize = VariantProps<typeof textareaVariants>['size'];
</script>

<script lang="ts">
	import { cn } from 'tailwind-variants';
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
	let inputGroup = getContext<{ variant: string; size: string } | undefined>('input-group');

	let {
		variant = inputGroup?.variant as TextareaVariant | undefined ?? 'outline',
		size = inputGroup?.size as TextareaSize | undefined ?? 'md',
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

<div class="grid relative {classes}" data-replicated-value={value} data-variant={variant}>
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
		class="placeholder:text-ink-400 outline-none"
		oninput={(e) => (value = (e.target as HTMLTextAreaElement).value)}
		{...rest}></textarea>
</div>

<style>
	div::after {
		content: attr(data-replicated-value) ' ';
		white-space: pre-wrap;
		visibility: hidden;
		grid-area: 1 / 1;
		word-wrap: break-word;
		min-width: 0;
	}

	div :global(textarea) {
		grid-area: 1 / 1;
		min-width: 0;
	}

	div::after,
	div :global(textarea) {
		padding: 0.5rem 0.75rem;
		line-height: 1.5;
	}

	div[data-variant='plain']::after,
	div[data-variant='plain'] :global(textarea) {
		padding: 0.5rem 0.75rem;
	}

	div :global(textarea) {
		background: transparent;
		border-radius: inherit;
		resize: none;
	}
</style>
