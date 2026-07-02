<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import Input from './Input.svelte';
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputVariant, InputSize } from './Input.svelte';

	type FieldContext = {
		id: string;
		name: string;
		describedBy?: string;
		invalid: boolean;
		required: boolean;
	};

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

	let field = getContext<FieldContext | undefined>('field');

	let inputRef: HTMLInputElement | undefined = $state();
	let hasInline = $derived(!!(start || end));

	let resolvedName = $derived(name ?? field?.name);
	let resolvedId = $derived(field?.id);
	let resolvedRequired = $derived(required ?? field?.required);
	let ariaDescribedBy = $derived(field?.describedBy);
	let ariaInvalid = $derived(field?.invalid || undefined);

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
		<div
			class={cn(
				'flex items-center flex-1 min-w-0 rounded-md border border-ink-200 bg-canvas text-ink-900',
				'transition duration-150 ease-in-out',
				'shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]',
				'focus-within:bg-ink-50 focus-within:border-focus-ring',
				'focus-within:outline-2 focus-within:outline-focus-ring focus-within:outline-offset-0',
				`has-[input[aria-invalid='true']]:border-negative`,
				variant === 'filled' && 'border-0 bg-ink-200/60',
				size === 'sm' && 'h-8 rounded-sm',
				size === 'lg' && 'h-12',
				!size && 'h-10',
				startAddon && 'rounded-l-none',
				endAddon && 'rounded-r-none',
				(startAddon || endAddon) && 'focus-within:z-10',
			)}
		>
			{#if start}
				<div
					role="button"
					tabindex="-1"
					onpointerdown={(e) => {
						e.preventDefault();
						focusInput();
					}}
					class="flex items-center pl-3 pr-2 text-ink-500 shrink-0"
				>
					{@render start()}
				</div>
			{/if}
			<input
				bind:this={inputRef}
				id={resolvedId}
				name={resolvedName}
				{type}
				bind:value
				{placeholder}
				required={resolvedRequired}
				{disabled}
				{readonly}
				{autocomplete}
				{inputmode}
				{pattern}
				aria-describedby={ariaDescribedBy}
				aria-invalid={ariaInvalid}
				oninput={(e) => (value = (e.target as HTMLInputElement).value)}
				class={cn(
					'flex-1 min-w-0 h-full bg-transparent border-none outline-none text-base',
					'placeholder:text-ink-400',
					'disabled:opacity-50 disabled:cursor-not-allowed',
					!start && 'pl-3',
					!end && 'pr-3',
				)}
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
