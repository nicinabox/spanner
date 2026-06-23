<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'inline-flex items-center gap-2 px-3 h-8 min-w-8 leading-none border rounded-md text-sm font-medium whitespace-nowrap cursor-pointer transition-[filter] duration-100 ease-out-expo no-underline',
		variants: {
			variant: {
				primary:
					'bg-brand-500 text-ink-50 border-brand-500 hover:bg-brand-600 active:bg-brand-700',
				secondary:
					'bg-transparent text-ink-900 border-brand-500 hover:bg-brand-100 active:bg-brand-300 active:text-brand-600',
				tertiary:
					'bg-transparent text-ink-900 border-transparent hover:bg-brand-200 active:bg-brand-300 active:text-brand-600',
				neutral: 'bg-ink-900 text-ink-50 border-ink-900 hover:bg-ink-700 active:bg-ink-900'
			},
			size: {
				sm: 'h-6 px-2 text-xs rounded-sm',
				md: 'h-8 px-3 text-sm',
				lg: 'h-10 px-4 text-base'
			},
			pill: { true: 'rounded-full' },
			block: { true: 'flex w-full justify-center' },
			icon: { true: 'px-0 justify-center' }
		},
		compoundVariants: [
			{ pill: true, size: 'sm', class: 'px-2.5' },
			{ pill: true, size: 'lg', class: 'px-4.5' }
		],
		defaultVariants: {
			size: 'md'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Radius = 'pill';
	type Theme = 'light' | 'dark';

	type Props = {
		variant?: ButtonVariant;
		radius?: Radius;
		size?: ButtonSize;
		theme?: Theme;
		block?: boolean;
		icon?: boolean;
		href?: string;
		type?: 'button' | 'submit' | 'reset' | null;
		disabled?: boolean | null;
		class?: ClassValue;
		children: Snippet;
		[key: string]: unknown;
	};

	let {
		variant = 'primary',
		size = 'md',
		radius,
		theme,
		block = false,
		icon = false,
		href,
		type = 'button',
		disabled,
		class: className,
		children,
		...rest
	}: Props = $props();

	let classes = $derived(
		cn(buttonVariants({ variant, size, pill: radius === 'pill', block, icon }), className)
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
