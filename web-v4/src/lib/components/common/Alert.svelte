<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const alertVariants = tv({
		base: 'p-3 rounded-md text-sm',
		variants: {
			variant: {
				negative: 'bg-negative/10 text-negative',
				positive: 'bg-positive/10 text-positive',
				warning: 'bg-warning/10 text-warning',
				info: 'bg-info/10 text-info',
			},
		},
		defaultVariants: {
			variant: 'negative',
		},
	});

	export type AlertVariant = VariantProps<typeof alertVariants>['variant'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		variant?: AlertVariant;
		role?: 'alert' | 'status';
		class?: ClassValue;
		children: Snippet;
	};

	let { variant = 'negative', role = 'alert', class: className, children }: Props = $props();
</script>

<div {role} class={cn(alertVariants({ variant }), className)}>
	{@render children()}
</div>
