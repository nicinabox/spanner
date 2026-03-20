<script lang="ts">
	import { cn } from '$lib/utils';
	import { setFieldContext, type FieldContext } from '$lib/utils/field.svelte';
	import { findFieldError, type FormError } from '$lib/utils/form';
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLAttributes, HTMLLabelAttributes } from 'svelte/elements';

	export type FormFieldProps = FieldContext & {
		label?: string;
		children: Snippet;
		hint?: string;
		errors?: FormError[];
		class?: ClassValue;
		attributes?: {
			label?: HTMLLabelAttributes;
			hint?: HTMLAttributes<HTMLSpanElement>;
		};
	};

	const {
		class: className,
		children,
		attributes,
		name,
		errors,
		label,
		required,
		hint,
		...props
	}: FormFieldProps = $props();

	let uid = $props.id();
	let error = findFieldError(name, errors);

	let state = $state<FieldContext>({
		...props,
		id: props.id ?? uid,
		name,
		invalid: Boolean(error)
	});

	setFieldContext(state);
</script>

<div class={cn('flex flex-col gap-1', className)}>
	<label
		{...attributes?.label}
		class="text-sm font-medium {attributes?.label?.class}"
		for={state.id}
	>
		{label}
		{#if required}<span class="text-red-400" aria-label="required">*</span>{/if}
	</label>

	{@render children()}

	{#if error}
		<span
			class="text-sm text-destructive first-letter:capitalize"
			id={state.id + '-error'}
			role="alert"
		>
			{error}
		</span>
	{:else}
		<span
			{...attributes?.hint}
			id={state.id + '-hint'}
			class="input-hint text-sm {attributes?.hint?.class}"
		>
			{hint}
		</span>
	{/if}
</div>
