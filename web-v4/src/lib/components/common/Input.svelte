<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const inputVariants = tv({
		base: 'w-full px-3 h-10 text-base rounded-md border border-ink-200 bg-canvas text-ink-900 transition duration-150 ease-in-out shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] placeholder:text-ink-400 disabled:opacity-50 disabled:cursor-not-allowed not-focus:aria-invalid:border-negative focus:bg-ink-50 focus-visible:border-focus-ring focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-0',
		variants: {
			variant: {
				outline: '',
				filled: 'border-0 bg-ink-200/60',
				plain: 'border-0 bg-transparent shadow-none rounded-none focus:bg-transparent focus-visible:border-transparent focus-visible:outline-none',
			},
			size: {
				sm: 'h-8 px-2 rounded-sm text-base',
				md: '',
				lg: 'h-12 px-4 text-base',
			},
		},
		defaultVariants: {
			size: 'md',
			variant: 'outline',
		},
	});

	export type InputVariant = VariantProps<typeof inputVariants>['variant'];
	export type InputSize = VariantProps<typeof inputVariants>['size'];
</script>

<script lang="ts">
	import { cn } from 'tailwind-variants';
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
		variant?: InputVariant;
		size?: InputSize;
		class?: string;
		ref?: HTMLInputElement | null;
	};

	let field = getContext<FieldContext | undefined>('field');
	let inputGroup = getContext<{ variant: string; size: string } | undefined>('input-group');

	let {
		variant = inputGroup?.variant as InputVariant | undefined ?? 'outline',
		size = inputGroup?.size as InputSize | undefined ?? 'md',
		name,
		value = $bindable(),
		required,
		class: className,
		ref = $bindable(),
		...rest
	}: Props = $props();

	let resolvedName = $derived(name ?? field?.name);
	let resolvedId = $derived(field?.id);
	let resolvedRequired = $derived(required ?? field?.required);
	let ariaDescribedBy = $derived(field?.describedBy);
	let ariaInvalid = $derived(field?.invalid || undefined);
	let classes = $derived(cn(inputVariants({ variant, size }), className));
</script>

<input
	bind:this={ref}
	id={resolvedId}
	name={resolvedName}
	bind:value={value}
	required={resolvedRequired}
	class={classes}
	aria-describedby={ariaDescribedBy}
	aria-invalid={ariaInvalid}
	{...rest}
/>
