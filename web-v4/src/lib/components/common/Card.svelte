<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const cardVariants = tv({
		base: 'bg-surface gap-6 flex flex-col',
		variants: {
			variant: {
				elevated: 'shadow-md border border-ink-200',
				outline: 'border border-ink-200',
				filled: 'bg-surface-raised'
			},
			size: {
				sm: 'p-4 rounded-md',
				md: 'p-8 rounded-lg',
				lg: 'p-10 rounded-xl'
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
