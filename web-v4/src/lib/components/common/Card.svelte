<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const cardVariants = tv({
		base: 'bg-surface',
		variants: {
			variant: {
				elevated: 'shadow-md',
				outline: 'border border-ink-200',
				filled: 'bg-surface-raised'
			},
			size: {
				sm: 'p-3 rounded-md',
				md: 'p-4 rounded-lg',
				lg: 'p-6 rounded-xl'
			}
		},
		defaultVariants: {
			variant: 'elevated',
			size: 'md'
		}
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
		class?: ClassValue;
		children: Snippet;
	};

	let { variant = 'elevated', size = 'md', class: className, children }: Props = $props();

	let classes = $derived(cn(cardVariants({ variant, size }), className));
</script>

<div class={classes}>
	{@render children()}
</div>
