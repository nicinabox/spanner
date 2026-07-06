<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const alertVariants = tv({
		base: 'px-4 py-3 rounded-md border border-current/10 bg-current/10',
		variants: {
			variant: {
				negative: 'text-red-700 dark:text-red-400',
				positive: 'text-positive',
				warning: 'text-amber-700 dark:text-amber-400',
				info: 'text-info',
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
	import { X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		variant?: AlertVariant;
		role?: 'alert' | 'status';
		class?: ClassValue;
		dismissible?: boolean;
		children: Snippet;
	};

	let {
		role = 'status',
		variant = role === 'alert' ? 'negative' : 'info',
		class: className,
		dismissible = false,
		children,
	}: Props = $props();

	let dismissed = $state(false);
</script>

{#if !dismissed}
	<div {role} class={cn(alertVariants({ variant }), 'relative', dismissible && 'pr-10', className)}>
		{@render children()}

		{#if dismissible}
			<button
				type="button"
				onclick={() => (dismissed = true)}
				class="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer opacity-80 hover:opacity-100"
				aria-label="Dismiss"
			>
				<X size={16} />
			</button>
		{/if}
	</div>
{/if}
