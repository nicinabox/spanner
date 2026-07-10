<script lang="ts">
	import * as menu from '@zag-js/menu';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';
	import Button from './Button.svelte';
	import type { ButtonSize } from './Button.svelte';
	import { Check, ChevronDown } from 'lucide-svelte';
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

{#snippet separator()}
	<li role="separator" class="h-px bg-ink-200 my-1 mx-2.5 p-0 cursor-default"></li>
{/snippet}

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

	<div use:portal {...api.getPositionerProps()} inert={!api.open}>
		<ul
			{...api.getContentProps()}
			hidden={undefined}
			class={[
				'z-50 list-none min-w-[max(var(--reference-width),15ch)] p-1.5 bg-surface-raised border border-ink-200 rounded-md shadow-md max-h-[50vh] overflow-y-auto',
				'origin-(--transform-origin,top) transition-[opacity,scale,translate] duration-250 ease-out-expo',
				'data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=open]:translate-y-0 data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.97] data-[state=closed]:-translate-y-2',
				'starting:opacity-0 starting:scale-[0.97] starting:-translate-y-2',
			]}
		>
			{#if start}
				<li role="menuitem" class="p-2 px-3 min-h-10">{@render start()}</li>
			{/if}
			{#each items as item}
				{#if item.separator}
					{@render separator()}
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
						{#if itemEnd}
							<span class="inline-flex items-center text-ink-400">{@render itemEnd(item)}</span>
						{/if}
					</li>
				{/if}
			{/each}
			{#if items.length > 0 && optionItems.length > 0}
				{@render separator()}
			{/if}
			{#each optionItems as item}
				{#if item.type === 'separator'}
					{@render separator()}
				{:else}
					<li
						{...api.getOptionItemProps(item as menu.OptionItemProps)}
						class="group flex items-center gap-2 px-3 h-10 rounded-sm cursor-pointer select-none outline-none transition-colors duration-100 ease-out-expo hover:bg-black/6 data-highlighted:bg-black/6 dark:hover:bg-white/8 dark:data-highlighted:bg-white/8 data-[type=radio]:pl-8 data-[type=radio]:relative data-[type=checkbox]:pl-8 data-[type=checkbox]:relative"
					>
						<span
							class="group-data-[type=radio]:absolute group-data-[type=radio]:left-1.5 group-data-[type=radio]:top-1/2 group-data-[type=radio]:-translate-y-1/2 group-data-[type=checkbox]:absolute group-data-[type=checkbox]:left-1.5 group-data-[type=checkbox]:top-1/2 group-data-[type=checkbox]:-translate-y-1/2 flex items-center justify-center size-5 shrink-0 [&_svg]:opacity-0 group-data-[state=checked]:[&_svg]:opacity-100"
							{...api.getItemIndicatorProps(item as menu.OptionItemProps)}
						>
							<Check size={16} />
						</span>
						<span {...api.getItemTextProps(item as menu.OptionItemProps)}>{item.label}</span>
					</li>
				{/if}
			{/each}

			{#if end}
				<li role="menuitem">
					{@render end()}
				</li>
			{/if}
		</ul>
	</div>
</div>
