<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'inline-flex items-center justify-center gap-2 px-3 h-8 min-w-fit leading-none border rounded-md text-sm font-medium whitespace-nowrap cursor-pointer transition-[filter] duration-100 ease-out-expo no-underline',
		variants: {
			variant: {
				solid: 'bg-brand-500 text-white border-brand-500 hover:bg-brand-600 active:bg-brand-700',
				outline:
					'bg-transparent text-brand-600 dark:text-brand-800 border-brand-500 hover:bg-brand-200 active:bg-brand-300 active:text-brand-600',
				ghost:
					'bg-transparent text-ink-900 border-transparent hover:bg-brand-200 active:bg-brand-300 active:text-brand-600',
			},
			color: {
				brand: '',
				neutral: '',
			},
			danger: {
				true: '',
			},
			size: {
				xs: 'h-6 px-2 text-xs rounded-sm',
				sm: 'h-8 px-3 text-sm',
				md: 'h-10 px-4 text-base',
				lg: 'h-12 px-5 text-lg',
			},
			pill: { true: 'rounded-full' },
			block: { true: 'flex w-full justify-center' },
			icon: { true: 'px-0 justify-center aspect-square' },
			active: {
				true: '',
			},
		},
		compoundVariants: [
			{ pill: true, size: 'xs', class: 'px-2.5' },
			{ pill: true, size: 'md', class: 'px-4.5' },
			{ pill: true, size: 'lg', class: 'px-5.5' },
			{ active: true, variant: 'solid', class: 'bg-brand-600' },
			{ active: true, variant: 'outline', class: 'bg-brand-100' },
			{ active: true, variant: 'ghost', class: 'bg-brand-200' },
			{
				color: 'neutral',
				variant: 'solid',
				class: 'bg-ink-900 text-ink-50 border-ink-900 hover:bg-ink-700 active:bg-ink-900',
			},
			{
				color: 'neutral',
				variant: 'outline',
				class:
					'bg-transparent text-ink-900 border-ink-300 hover:bg-ink-100 active:bg-ink-300 active:text-ink-600',
			},
			{
				color: 'neutral',
				variant: 'ghost',
				class:
					'bg-transparent text-ink-900 border-transparent hover:bg-ink-200 active:bg-ink-300 active:text-ink-600',
			},
			{ color: 'neutral', active: true, variant: 'solid', class: 'bg-ink-700' },
			{ color: 'neutral', active: true, variant: 'outline', class: 'bg-ink-100' },
			{ color: 'neutral', active: true, variant: 'ghost', class: 'bg-ink-200' },
			{
				danger: true,
				variant: 'solid',
				class: [
					'border-0 bg-negative/10 text-negative hover:bg-negative/20 active:bg-negative/30 active:text-negative',
					'dark:bg-negative/30 dark:hover:bg-negative/40 dark:active:bg-negative/50',
				],
			},
			{
				danger: true,
				variant: 'ghost',
				class:
					'text-ink-900 hover:text-negative hover:bg-negative/20 active:bg-negative/30 active:text-negative',
			},
			{
				danger: true,
				variant: 'outline',
				class:
					'border-negative/30 text-negative hover:bg-negative/10 active:bg-negative/30 active:text-negative',
			},
		],
		defaultVariants: {
			size: 'md',
			color: 'brand',
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonColor = VariantProps<typeof buttonVariants>['color'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Theme = 'light' | 'dark';

	type Props = {
		variant?: ButtonVariant;
		color?: ButtonColor;
		pill?: boolean;
		size?: ButtonSize;
		theme?: Theme;
		block?: boolean;
		icon?: boolean;
		active?: boolean;
		href?: string;
		type?: 'button' | 'submit' | 'reset' | null;
		danger?: boolean;
		disabled?: boolean | null;
		class?: ClassValue;
		children: Snippet;
		[key: string]: unknown;
	};

	let {
		variant = 'solid',
		color = 'brand',
		size = 'md',
		pill = false,
		theme,
		block = false,
		icon = false,
		danger = false,
		active = false,
		href,
		type = 'button',
		disabled,
		class: className,
		children,
		...rest
	}: Props = $props();

	let classes = $derived(
		cn(buttonVariants({ variant, color, size, pill, block, active, danger, icon }), className),
	);

	let attrs = $derived(theme ? { 'data-theme': theme, ...rest } : rest);
</script>

{#if href}
	<a {href} class={classes} aria-disabled={disabled || undefined} {...attrs}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} class={classes} {...attrs}>
		{@render children()}
	</button>
{/if}
