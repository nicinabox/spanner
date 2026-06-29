<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import Input from './Input.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputVariant, InputSize } from './Input.svelte';

	type Props = Omit<HTMLInputAttributes, 'size'> & {
		variant?: InputVariant;
		size?: InputSize;
		class?: string;
		start?: Snippet;
		end?: Snippet;
		startAddon?: Snippet;
		endAddon?: Snippet;
	};

	let {
		variant,
		size,
		name,
		type = 'text',
		value = $bindable(),
		placeholder,
		required,
		disabled,
		readonly,
		autocomplete,
		inputmode,
		pattern,
		start,
		end,
		startAddon,
		endAddon,
		class: className,
		...rest
	}: Props = $props();

	let inputRef: HTMLInputElement | undefined = $state();
	let hasInline = $derived(!!(start || end));

	function focusInput() {
		inputRef?.focus();
	}
</script>

<div class={cn('flex', className)}>
	{#if startAddon}
		<span
			class="inline-flex items-center rounded-l-md border border-r-0 border-ink-200 bg-ink-50 px-5 text-sm text-ink-500"
		>
			{@render startAddon()}
		</span>
	{/if}
	{#if hasInline}
		<div
			class={cn('relative flex-1', startAddon && 'rounded-l-none', endAddon && 'rounded-r-none')}
		>
			<Input
				bind:ref={inputRef}
				{variant}
				{size}
				{name}
				{type}
				bind:value
				{placeholder}
				{required}
				{disabled}
				{readonly}
				{autocomplete}
				{inputmode}
				{pattern}
				class={cn(
					start && 'pl-10',
					end && 'pr-10',
					startAddon && 'rounded-l-none',
					endAddon && 'rounded-r-none',
					(startAddon || endAddon) && 'focus-visible:z-10',
				)}
				{...rest}
			/>
			{#if start}
				<div
					role="button"
					tabindex="-1"
					onpointerdown={(e) => {
						e.preventDefault();
						focusInput();
					}}
					class="absolute inset-y-0 left-0 flex items-center px-3 text-ink-500"
				>
					{@render start()}
				</div>
			{/if}
			{#if end}
				<div
					role="button"
					tabindex="-1"
					onpointerdown={(e) => {
						e.preventDefault();
						focusInput();
					}}
					class="absolute inset-y-0 right-0 flex items-center px-3 text-ink-500"
				>
					{@render end()}
				</div>
			{/if}
		</div>
	{:else}
		<Input
			bind:ref={inputRef}
			{variant}
			{size}
			{name}
			{type}
			bind:value
			{placeholder}
			{required}
			{disabled}
			{readonly}
			{autocomplete}
			{inputmode}
			{pattern}
			class={cn(
				'flex-1',
				startAddon && 'rounded-l-none',
				endAddon && 'rounded-r-none',
				(startAddon || endAddon) && 'focus-visible:z-10',
			)}
			{...rest}
		/>
	{/if}
	{#if endAddon}
		<span
			class="inline-flex items-center rounded-r-md border border-l-0 border-ink-200 bg-ink-50 px-5 text-sm text-ink-500"
		>
			{@render endAddon()}
		</span>
	{/if}
</div>
