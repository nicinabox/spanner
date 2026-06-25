<script lang="ts">
	import { setContext } from 'svelte';
	import type { FormError } from '$lib/utils/form';
	import type { Snippet } from 'svelte';

	type Props = {
		name: string;
		label: string;
		hint?: string;
		errors?: FormError[];
		required?: boolean;
		class?: string;
		children: Snippet;
	};

	let {
		name,
		label,
		hint,
		errors = [],
		required = false,
		class: className,
		children
	}: Props = $props();

	let id = $derived(name);
	let fieldErrors = $derived(errors.filter((e) => e.id === name));
	let hasErrors = $derived(fieldErrors.length > 0);

	let describedBy = $derived(
		[hasErrors && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
	);

	setContext('field', {
		get id() { return id; },
		get name() { return name; },
		get describedBy() { return describedBy; },
		get invalid() { return hasErrors; },
		get required() { return required; }
	});
</script>

<div class="group flex flex-col gap-1 mb-4{className ? ` ${className}` : ''}" data-invalid={hasErrors || undefined}>
	<label for={id} class="font-medium text-base group-data-invalid:text-negative">
		{label}
		{#if required}<span class="text-negative ml-1" aria-hidden="true">*</span>{/if}
	</label>

	{@render children?.()}

	{#if hint && !hasErrors}
		<p id="{id}-hint" class="text-sm text-ink-400">{hint}</p>
	{/if}

	{#each fieldErrors as error (error.id)}
		<p id="{id}-error" class="text-sm text-negative">{error.title}</p>
	{/each}
</div>