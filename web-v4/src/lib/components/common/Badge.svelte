<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const badgeVariants = tv({
		base: 'inline-flex items-center gap-1 overflow-hidden h-5 min-w-5 text-center font-medium',
		variants: {
			variant: {
				warning: 'bg-warning text-black/60 dark:text-black/70',
				neutral: 'bg-ink-900/10 text-ink-500 dark:bg-ink-300 dark:text-ink-700',
			},
			pill: {
				true: 'rounded-full',
			},
			size: {
				sm: 'text-xs px-1.5 rounded-[4px]',
				md: 'text-sm px-2 h-6 min-w-6 rounded-sm',
			},
		},
		defaultVariants: {
			size: 'sm',
			variant: 'neutral',
			pill: false,
		},
	});

	export const badgeDismissVariants = tv({
		base: 'flex items-center justify-center h-[inherit] aspect-square cursor-pointer opacity-80 hover:opacity-100',
		variants: {
			variant: {
				warning: '',
				neutral: 'hover:text-ink-900',
			},
			size: {
				sm: '-m-1.5 -ml-0.5',
				md: '-m-2 -ml-0.5',
			},
		},
		defaultVariants: {
			size: 'sm',
			variant: 'neutral',
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
	export type BadgeSize = VariantProps<typeof badgeVariants>['size'];
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
		ondismiss?: () => void;
		size?: BadgeSize;
	};

	let {
		variant = 'neutral',
		pill = false,
		class: className,
		dismissible = false,
		size,
		ondismiss,
		children,
	}: Props = $props();

	let dismissed = $state(false);
</script>

{#if !dismissed}
	<span class={cn(badgeVariants({ variant, pill, size }), className)}>
		{@render children()}

		{#if dismissible}
			<button
				type="button"
				onclick={() => {
					dismissed = true;
					ondismiss?.();
				}}
				class={badgeDismissVariants({ variant, size })}
				aria-label="Dismiss"
			>
				<X size={14} />
			</button>
		{/if}
	</span>
{/if}
