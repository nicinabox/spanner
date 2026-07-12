<script lang="ts">
	import * as menu from '@zag-js/menu';
	import { useMachine, normalizeProps } from '@zag-js/svelte';
	import Button from './Button.svelte';
	import type { ButtonSize } from './Button.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import MenuContent from './MenuContent.svelte';
	import type { ClassValue } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type Item = {
		value: string;
		label?: string;
		href?: string;
		preload?: boolean;
		separator?: boolean;
		closeOnSelect?: boolean;
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
		start?: Snippet;
		end?: Snippet;
		items?: Item[];
		optionItems?: OptionItem[];
		theme?: 'light' | 'dark';
		variant?: 'solid' | 'outline' | 'ghost';
		color?: 'brand' | 'neutral';
		size?: ButtonSize;
		class?: ClassValue;
		onSelect?: (details: { value: string }) => void;
		id?: string;
		itemEnd?: Snippet<[Item]>;
	}

	const defaultId = $props.id();

	let {
		trigger,
		start,
		end,
		items = [],
		optionItems = [],
		theme,
		variant = 'ghost',
		color,
		size,
		class: className,
		id = defaultId,
		onSelect,
		itemEnd,
	}: Props = $props();
	// svelte-ignore state_referenced_locally
	const service = useMachine(menu.machine, {
		id,
		onSelect,
		defaultHighlightedValue: items[0]?.value,
	});
	const api = $derived(menu.connect(service, normalizeProps));

	// Omit onpointerdown from trigger props so the browser applies :active CSS
	const triggerProps = $derived.by(() => {
		const { onpointerdown: _od, ...rest } = api.getTriggerProps();
		return rest;
	});

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

<div class="relative leading-none" data-theme={theme}>
	<Button
		{...triggerProps}
		active={api.open}
		data-theme={theme}
		{variant}
		{color}
		{size}
		class={className}
	>
		{#if typeof trigger === 'function'}
			{@render trigger()}
		{:else}
			{trigger}
		{/if}
		<span {...api.getIndicatorProps()}><ChevronDown size={16} /></span>
	</Button>

	<MenuContent {api} {items} {optionItems} {start} {end} {itemEnd} />
</div>
