<script lang="ts">
	import * as menu from '@zag-js/menu';
	import { useMachine, normalizeProps } from '@zag-js/svelte';
	import Button from './Button.svelte';
	import type { ButtonSize, ButtonVariant, ButtonColor } from './Button.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import MenuContent from './MenuContent.svelte';
	import type { ClassValue } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type SplitButtonItem = {
		value: string;
		label?: string;
		href?: string;
		preload?: boolean;
		separator?: boolean;
		closeOnSelect?: boolean;
	};

	interface Props {
		children: Snippet;
		items: SplitButtonItem[];
		onAction?: () => void;
		onSelect?: (details: { value: string }) => void;
		variant?: ButtonVariant;
		color?: ButtonColor;
		size?: ButtonSize;
		disabled?: boolean | null;
		class?: ClassValue;
		id?: string;
		start?: Snippet;
		end?: Snippet;
	}

	const uniqId = $props.id();

	let {
		children,
		items,
		onAction,
		onSelect,
		variant = 'solid',
		color = 'brand',
		size = 'md',
		disabled,
		class: className,
		id = uniqId,
		start,
		end,
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	const service = useMachine(menu.machine, {
		id,
		onSelect,
		defaultHighlightedValue: items[0]?.value,
		positioning: {
			placement: 'bottom-end',
		},
	});
	const api = $derived(menu.connect(service, normalizeProps));

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

<div class="inline-flex items-center gap-px {className}">
	<Button {variant} {color} {size} {disabled} class="rounded-r-none" onclick={onAction}>
		{@render children()}
	</Button>
	<Button
		{...triggerProps}
		active={api.open}
		{variant}
		{color}
		{size}
		{disabled}
		icon
		class={['rounded-l-none', variant === 'outline' && 'border-l-0 -ml-px']}
	>
		<ChevronDown size={16} />
	</Button>

	<MenuContent {api} {items} {start} {end} />
</div>
