<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import Input, { inputVariants } from './Input.svelte';
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

	let wrapperClasses = $derived(
		cn(
			inputVariants({ variant, size }),
			'flex items-center flex-1 min-w-0 px-0',
			'focus-within:bg-ink-50 focus-within:border-focus-ring',
			'focus-within:outline-2 focus-within:outline-focus-ring focus-within:outline-offset-0',
			`has-[input[aria-invalid='true']]:border-negative`,
			startAddon && 'rounded-l-none',
			endAddon && 'rounded-r-none',
			(startAddon || endAddon) && 'focus-within:z-10',
		),
	);

	let inputClasses = $derived(
		cn(
			'flex-1 min-w-0 border-none bg-transparent shadow-none px-0',
			'focus:bg-transparent focus-visible:border-transparent focus-visible:outline-none',
			!start && 'pl-3',
			!end && 'pr-3',
		),
	);

	function focusInput() {
		inputRef?.focus();
	}
</script>

<div class={cn('flex min-w-0', className)}>
	{#if startAddon}
		<span
			class="inline-flex items-center rounded-l-md border border-r-0 border-ink-200 bg-ink-50 px-5 text-sm text-ink-500"
		>
			{@render startAddon()}
		</span>
	{/if}
	{#if hasInline}
		<div class={cn('wrapper', wrapperClasses)}>
			{#if start}
				<div
					role="button"
					tabindex="-1"
					onpointerdown={(e) => {
						e.preventDefault();
						focusInput();
					}}
					class="flex items-center pl-3 pr-2 text-ink-500 shrink-0 only:hidden"
				>
					{@render start()}
				</div>
			{/if}
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
				class={inputClasses}
				{...rest}
			/>
			{#if end}
				<div
					role="button"
					tabindex="-1"
					onpointerdown={(e) => {
						e.preventDefault();
						focusInput();
					}}
					class="flex items-center pr-3 pl-2 text-ink-500 shrink-0"
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

<style>
	.wrapper :global(button) {
		border-radius: 0.25rem;
	}
</style>
