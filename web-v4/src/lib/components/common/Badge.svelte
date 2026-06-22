<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Variant = 'warning' | 'neutral';

	type Props = {
		variant?: Variant;
		class?: ClassValue;
		children: Snippet;
	};

	let { variant = 'neutral', class: className, children }: Props = $props();
</script>

<span class="badge {variant} {className}">
	{@render children()}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		height: var(--space-5);
		padding-inline: var(--space-1-5);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--weight-medium);
	}

	.warning {
		background: var(--color-warning);
		color: color-mix(in oklch, var(--color-warning), black 60%);
	}

	.neutral {
		background: color-mix(in oklch, var(--color-ink), transparent 90%);
		color: var(--color-ink-medium);
	}
</style>
