<script lang="ts">
	import * as menu from '@zag-js/menu';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';
	import Button from './Button.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import type { ClassValue } from 'svelte/elements';

	type Item = { value: string; label?: string; href?: string; preload?: boolean };

	interface Props {
		trigger: any;
		items: Item[];
		children?: (item: Item, fallback: () => string) => any;
		theme?: 'light' | 'dark';
		variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
		class?: ClassValue;
		onSelect?: (details: { value: string }) => void;
		id?: string;
	}

	const defaultId = $props.id();

	let {
		trigger,
		items,
		children,
		theme,
		variant = 'tertiary',
		class: className,
		id = defaultId,
		onSelect
	}: Props = $props();
	// svelte-ignore state_referenced_locally
	const service = useMachine(menu.machine, {
		id,
		onSelect,
		defaultHighlightedValue: items[0]?.value
	});
	const api = $derived(menu.connect(service, normalizeProps));

	let highlighted = $state(false);

	$effect(() => {
		if (api.open) {
			if (!highlighted && items.length > 0) {
				api.setHighlightedValue(items[0].value);
				highlighted = true;
			}
		} else {
			highlighted = false;
		}
	});
</script>

<div class="menu" data-theme={theme}>
	<Button {...api.getTriggerProps()} data-theme={theme} {variant} class={className}>
		{trigger} <span {...api.getIndicatorProps()}><ChevronDown size={16} /></span>
	</Button>

	<div use:portal {...api.getPositionerProps()}>
		<ul {...api.getContentProps()} hidden={undefined}>
			{#each items as item}
				{const computed = children
					? children(item, () => item.label ?? item.value)
					: (item.label ?? item.value)}
				{const preload = item.preload ?? true}

				<li {...api.getItemProps({ value: item.value })}>
					{#if item.href}
						<a
							href={item.href}
							tabindex="-1"
							data-sveltekit-preload-data={preload ? 'hover' : 'off'}
						>
							{computed}
						</a>
					{:else}
						{computed}
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
		min-width: var(--reference-width, 15ch);
		padding: var(--space-1);
		background-color: var(--color-surface-raised);
		border: 1px solid var(--color-ink-lightest);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		transform-origin: var(--transform-origin, top);
		transition:
			opacity var(--duration-slow) var(--ease-out-expo),
			transform var(--duration-slow) var(--ease-out-expo);
	}

	ul[data-state='open'] {
		opacity: 1;
		transform: scale(1) translateY(0);
	}

	ul[data-state='closed'] {
		opacity: 0;
		transform: scale(0.97) translateY(-8px);
	}

	@starting-style {
		ul[data-state='open'] {
			opacity: 0;
			transform: scale(0.97) translateY(-8px);
		}
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
		display: block;
		width: 100%;
	}

	li:hover,
	li[data-highlighted] {
		background-color: color-mix(in oklch, var(--color-surface-raised), black 6%);
	}

	:global([data-theme='dark']) {
		li:hover,
		li[data-highlighted] {
			background-color: color-mix(in oklch, var(--color-surface-raised), white 8%);
		}
	}
</style>
