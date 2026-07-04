<script lang="ts">
	import * as menu from '@zag-js/menu';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';
	import Button from './Button.svelte';
	import type { ButtonSize, ButtonVariant, ButtonColor } from './Button.svelte';
	import { ChevronDown } from 'lucide-svelte';
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
	}

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
		id = 'split-btn',
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
</div>

<div use:portal {...api.getPositionerProps()} inert={!api.open}>
	<ul
		{...api.getContentProps()}
		hidden={undefined}
		class={[
			'z-50 list-none w-(--reference-width) min-w-[15ch] p-1.5 bg-surface-raised border border-ink-200 rounded-md shadow-md',
			'origin-(--transform-origin,top) transition-[opacity,scale,translate] duration-250 ease-out-expo',
			'data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=open]:translate-y-0 data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.97] data-[state=closed]:-translate-y-2',
			'starting:opacity-0 starting:scale-[0.97] starting:-translate-y-2',
		]}
	>
		{#each items as item}
			{#if item.separator}
				<li role="separator" class="h-px bg-ink-200 my-1 mx-2.5 p-0 cursor-default"></li>
			{:else}
				{const preload = item.preload ?? true}
				<li
					{...api.getItemProps({ value: item.value, closeOnSelect: item.closeOnSelect ?? true })}
					class="flex items-center gap-2 px-3 h-10 rounded-sm cursor-pointer select-none outline-none transition-colors duration-100 ease-out-expo hover:bg-black/6 data-highlighted:bg-black/6 dark:hover:bg-white/8 dark:data-highlighted:bg-white/8"
				>
					<span class="flex-1 min-w-0">
						{#if item.href}
							<a
								href={item.href}
								tabindex="-1"
								data-sveltekit-preload-data={preload ? 'hover' : 'off'}
								class="text-inherit no-underline block w-full"
							>
								{item.label ?? item.value}
							</a>
						{:else}
							{item.label ?? item.value}
						{/if}
					</span>
				</li>
			{/if}
		{/each}
	</ul>
</div>
