<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const badgeVariants = tv({
		base: 'inline-flex items-center gap-1 overflow-hidden h-5 min-w-5 text-center px-1.5 rounded-[4px] text-xs font-medium',
		variants: {
			variant: {
				warning: 'bg-warning text-black/60 dark:text-black/70',
				neutral: 'bg-ink-900/10 text-ink-500 dark:bg-ink-300 dark:text-ink-700',
			},
			pill: {
				true: 'rounded-full',
			},
		},
		defaultVariants: {
			variant: 'neutral',
			pill: false,
		},
	});

	export const badgeDismissVariants = tv({
		base: 'flex items-center justify-center -m-1.5 ml-0.5 h-[inherit] aspect-square cursor-pointer opacity-80 hover:opacity-100 rounded-r-[3px]',
		variants: {
			variant: {
				warning: 'bg-black/10 dark:bg-black/20',
				neutral: 'bg-ink-500/20 dark:bg-ink-400',
			},
		},
		defaultVariants: {
			variant: 'neutral',
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		variant?: BadgeVariant;
		class?: ClassValue;
		children: Snippet;
		pill?: boolean;
		dismissible?: boolean;
	};

	let {
		variant = 'neutral',
		pill = false,
		class: className,
		dismissible = false,
		children,
	}: Props = $props();

	let dismissed = $state(false);
</script>

{#if !dismissed}
	<span class={cn(badgeVariants({ variant, pill }), className)}>
		{@render children()}

		{#if dismissible}
			<button
				type="button"
				onclick={() => (dismissed = true)}
				class={badgeDismissVariants({ variant })}
				aria-label="Dismiss"
			>
				<X size={12} />
			</button>
		{/if}
	</span>
{/if}
