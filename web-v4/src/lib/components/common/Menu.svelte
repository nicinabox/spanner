<script lang="ts">
	import * as menu from '@zag-js/menu';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';
	import Button from './Button.svelte';
	import { Check, ChevronDown } from 'lucide-svelte';
	import type { ClassValue } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type Item = {
		value: string;
		label?: string;
		href?: string;
		preload?: boolean;
		separator?: boolean;
	};

	export type OptionItem = {
		type: 'radio' | 'checkbox' | 'separator';
		name?: string;
		value?: string;
		label?: string;
		checked?: boolean;
		onCheckedChange?: (checked: boolean) => void;
	};

	interface Props {
		trigger: string | Snippet;
		items?: Item[];
		optionItems?: OptionItem[];
		theme?: 'light' | 'dark';
		variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
		class?: ClassValue;
		onSelect?: (details: { value: string }) => void;
		id?: string;
	}

	const defaultId = $props.id();

	let {
		trigger,
		items = [],
		optionItems = [],
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
		{#if typeof trigger === 'function'}
			{@render trigger()}
		{:else}
			{trigger}
		{/if}
		<span {...api.getIndicatorProps()}><ChevronDown size={16} /></span>
	</Button>

	<div use:portal {...api.getPositionerProps()}>
		<ul {...api.getContentProps()} hidden={undefined}>
			{#each items as item}
				{#if item.separator}
					<li role="separator" class="separator"></li>
				{:else}
					{const preload = item.preload ?? true}
					<li {...api.getItemProps({ value: item.value })}>
						{#if item.href}
							<a
								href={item.href}
								tabindex="-1"
								data-sveltekit-preload-data={preload ? 'hover' : 'off'}
							>
								{item.label ?? item.value}
							</a>
						{:else}
							{item.label ?? item.value}
						{/if}
					</li>
				{/if}
			{/each}
			{#if items.length > 0 && optionItems.length > 0}
				<li role="separator" class="separator"></li>
			{/if}
			{#each optionItems as item}
				{#if item.type === 'separator'}
					<li role="separator" class="separator"></li>
				{:else}
					<li {...api.getOptionItemProps(item as menu.OptionItemProps)}>
						<span
							class="check-indicator"
							{...api.getItemIndicatorProps(item as menu.OptionItemProps)}
						>
							<Check size={16} />
						</span>
						<span {...api.getItemTextProps(item as menu.OptionItemProps)}>{item.label}</span>
					</li>
				{/if}
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
		padding: 0.25rem;
		background-color: var(--color-surface-raised);
		border: 1px solid var(--color-ink-200);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		transform-origin: var(--transform-origin, top);
		transition:
			opacity 0.25s var(--ease-out-expo),
			transform 0.25s var(--ease-out-expo);
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
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-sm);
		cursor: pointer;
		user-select: none;
		outline: none;
		transition: background-color 100ms var(--ease-out-expo);
	}

	.check-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		flex-shrink: 0;
	}

	.check-indicator :global(svg) {
		opacity: 0;
	}

	li[data-state='checked'] .check-indicator :global(svg) {
		opacity: 1;
	}

	li a {
		color: inherit;
		text-decoration: none;
		display: block;
		width: 100%;
	}

	li[data-type='radio'] {
		padding-left: 2rem;
		position: relative;
	}

	li[data-type='radio'] .check-indicator {
		position: absolute;
		left: 0.25rem;
		top: 50%;
		transform: translateY(-50%);
	}

	li[role='separator'] {
		height: 1px;
		background-color: var(--color-ink-200);
		margin: 0.25rem 0;
		padding: 0;
		cursor: default;
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
