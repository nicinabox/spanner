<script lang="ts">
	import * as menu from '@zag-js/menu';
	import { useMachine, normalizeProps } from '@zag-js/svelte';
	import Button from './Button.svelte';
	import type { ButtonSize, ButtonColor } from './Button.svelte';
	import MenuContent from './MenuContent.svelte';
	import type { ClassValue } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { ChevronDown } from 'lucide-svelte';

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
		children?: Snippet;
		start?: Snippet;
		end?: Snippet;
		positioning?: menu.PositioningOptions;
		items?: Item[];
		optionItems?: OptionItem[];
		theme?: 'light' | 'dark';
		variant?: 'solid' | 'outline' | 'ghost';
		color?: ButtonColor;
		icon?: boolean;
		size?: ButtonSize;
		class?: ClassValue;
		disabled?: boolean | null;
		onSelect?: (details: { value: string }) => void;
		id?: string;
		itemEnd?: Snippet<[Item]>;
	}

	const defaultId = $props.id();

	let {
		children,
		start,
		end,
		items = [],
		optionItems = [],
		theme,
		variant = 'ghost',
		positioning,
		icon,
		color,
		size,
		class: className,
		disabled,
		id = defaultId,
		onSelect,
		itemEnd,
	}: Props = $props();
	// svelte-ignore state_referenced_locally
	const service = useMachine(menu.machine, {
		id,
		onSelect,
		positioning,
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

<Button
	{...triggerProps}
	active={api.open}
	data-theme={theme}
	{icon}
	{variant}
	{color}
	{size}
	{disabled}
	class={className}
>
	{@render children?.()}
	<span {...api.getIndicatorProps()}><ChevronDown size={16} /></span>
</Button>

<MenuContent {api} {items} {optionItems} {start} {end} {itemEnd} />
