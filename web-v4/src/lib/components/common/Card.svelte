<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const cardVariants = tv({
		base: 'bg-surface gap-6 flex flex-col',
		variants: {
			variant: {
				elevated: 'shadow-md border border-ink-200',
				outline: 'border border-ink-200',
				filled: 'bg-surface-raised',
			},
			size: {
				sm: 'p-4 rounded-md',
				md: 'p-6 sm:p-8 rounded-lg',
				lg: 'p-8 sm:p-10 rounded-xl',
			},
		},
		defaultVariants: {
			variant: 'elevated',
			size: 'md',
		},
	});

	export type CardVariant = VariantProps<typeof cardVariants>['variant'];
	export type CardSize = VariantProps<typeof cardVariants>['size'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		variant?: CardVariant;
		size?: CardSize;
		bleed?: boolean;
		class?: ClassValue;
		children: Snippet;
		heading?: string;
	};

	let {
		variant = 'elevated',
		size = 'md',
		bleed = false,
		class: className,
		heading,
		children,
	}: Props = $props();

	let classes = $derived(cn(cardVariants({ variant, size }), className));
</script>

<div class={classes} class:bleed>
	{#if heading}
		<h2 class="font-bold text-xl">{heading}</h2>
	{/if}
	{@render children()}
</div>

<style>
	@media (max-width: 639px) {
		.bleed {
			margin-left: calc(-1 * var(--main-padding));
			margin-right: calc(-1 * var(--main-padding));
			border-left-width: 0;
			border-right-width: 0;
			border-radius: 0;
		}
	}
</style>
