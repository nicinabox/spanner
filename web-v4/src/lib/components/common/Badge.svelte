<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Variant = 'warning' | 'neutral';

	type Props = {
		variant?: Variant;
		class?: ClassValue;
		children: Snippet;
		pill?: boolean;
	};

	let { variant = 'neutral', pill = false, class: className, children }: Props = $props();
</script>

<span
	class={cn(
		'inline-flex items-center gap-1 h-5 px-1.5 rounded-sm text-xs font-medium',
		pill ? 'rounded-full' : '',
		variant === 'warning' ? 'badge-warning' : 'badge-neutral',
		className
	)}
>
	{@render children()}
</span>

<style>
	.badge-warning {
		background: var(--color-warning);
		color: color-mix(in oklch, var(--color-warning), black 60%);
	}

	.badge-neutral {
		background: color-mix(in oklch, var(--color-ink-900), transparent 90%);
		color: var(--color-ink-500);
	}
</style>
