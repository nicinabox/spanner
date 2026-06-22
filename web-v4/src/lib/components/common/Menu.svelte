<script lang="ts">
	import * as menu from '@zag-js/menu';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';
	import Button from './Button.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import type { ClassValue } from 'svelte/elements';

	type Item = { value: string; label?: string; href?: string };

	interface Props {
		trigger: any;
		items: Item[];
		children?: (item: Item, fallback: () => string) => any;
		theme?: 'light' | 'dark';
		variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
		class?: ClassValue;
		onSelect?: (details: { value: string }) => void;
	}

	const {
		trigger,
		items,
		children,
		theme,
		variant = 'tertiary',
		class: className,
		onSelect,
		id
	}: Props = $props();
	const service = useMachine(menu.machine, { id, onSelect });
	const api = $derived(menu.connect(service, normalizeProps));
</script>

<div class="menu" data-theme={theme}>
	<Button {...api.getTriggerProps()} data-theme={theme} {variant} class={className}>
		{trigger} <span {...api.getIndicatorProps()}><ChevronDown size={16} /></span>
	</Button>

	<div use:portal {...api.getPositionerProps()}>
		<ul {...api.getContentProps()}>
			{#each items as item}
				<li {...api.getItemProps({ value: item.value })}>
					{#if item.href}
						<a href={item.href} data-sveltekit-preload-data="off">
							{children
								? children(item, () => item.label ?? item.value)
								: (item.label ?? item.value)}
						</a>
					{:else}
						{children ? children(item, () => item.label ?? item.value) : (item.label ?? item.value)}
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.menu {
		position: relative;
	}

	ul {
		list-style: none;
		min-width: 10rem;
		padding: var(--space-1);
		background-color: var(--color-surface-raised);
		border: 1px solid var(--color-ink-lightest);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
	}

	li {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-1-5) var(--space-3);
		border-radius: var(--radius-sm);
		cursor: pointer;
		user-select: none;
		outline: none;
		transition: background-color var(--duration-fast) var(--ease-out-expo);
	}

	li a {
		color: inherit;
		text-decoration: none;
	}

	li:hover {
		background-color: color-mix(in oklch, var(--color-surface-raised), black 6%);
	}

	:global([data-theme='dark']) li:hover {
		background-color: color-mix(in oklch, var(--color-surface-raised), white 8%);
	}

	li:focus-visible {
		outline: 2px solid var(--color-focus-ring);
		outline-offset: -2px;
	}

	.menu :global(.btn[aria-expanded='true']) {
		--btn-bg: var(--color-brand-lightest);
		--btn-border: var(--color-brand-light);
	}
</style>
