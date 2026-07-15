<script lang="ts">
	import * as menu from '@zag-js/menu';
	import { portal } from '@zag-js/svelte';
	import { Check } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import type { Item, OptionItem } from './Menu.svelte';

	interface Props {
		api: menu.Api;
		items: Item[];
		optionItems?: OptionItem[];
		start?: Snippet;
		end?: Snippet;
		itemEnd?: Snippet<[Item]>;
		class?: ClassValue;
	}

	let { api, items, optionItems = [], start, end, itemEnd, class: className }: Props = $props();
</script>

{#snippet separator()}
	<li role="separator" class="h-px bg-ink-200 my-1 mx-2.5 p-0 cursor-default"></li>
{/snippet}

<div use:portal {...api.getPositionerProps()} inert={!api.open}>
	<ul
		{...api.getContentProps()}
		hidden={undefined}
		class={[
			'z-50 list-none p-1.5 bg-surface-raised border border-ink-200 rounded-md shadow-md',
			'origin-(--transform-origin,top) transition-[opacity,scale,translate] duration-250 ease-out-expo',
			'data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=open]:translate-y-0 data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.97] data-[state=closed]:-translate-y-2',
			'starting:opacity-0 starting:scale-[0.97] starting:-translate-y-2',
			'min-w-[max(var(--reference-width),15ch)] max-h-[50vh] overflow-y-auto',
			className,
		]}
	>
		{#if start}
			<li role="menuitem" class="flex items-center min-h-10">{@render start()}</li>
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
			<li role="menuitem" class="flex items-center min-h-10">
				{@render end()}
			</li>
		{/if}
	</ul>
</div>
