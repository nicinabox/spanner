<script lang="ts">
	import { findFieldError, type FormError } from '$lib/utils/form';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type FormControlProps = {
		value: unknown;
		name: string;
		id: string;
		class: HTMLAttributes<EventTarget>['class'];
		required: boolean | undefined;
		ariaRequired: boolean | undefined;
		placeholder: string | undefined;
	};

	export type FormFieldProps<ExtraProps = object> = {
		errors?: FormError[];
		name: string;
		label?: string;
		hint?: string;
		value?: unknown;
		class?: HTMLAttributes<EventTarget>['class'];
		required?: boolean;
		children?: Snippet<[FormControlProps & ExtraProps]>;
		placeholder?: string;
		attributes?: {
			label?: HTMLAttributes<HTMLLabelElement>;
			hint?: HTMLAttributes<HTMLSpanElement>;
		};
	} & ExtraProps;

	let {
		children,
		name,
		label,
		hint,
		value,
		required,
		errors,
		attributes,
		placeholder,
		...props
	}: FormFieldProps = $props();

	const uid = $props.id();

	let fieldError = findFieldError(name, errors);
</script>

<div class="flex flex-col gap-1" {...props}>
	<label {...attributes?.label} class="label {attributes?.label?.class}" for={uid + name}>
		{label}
		{#if required}<span class="text-red-400">*</span>{/if}
	</label>

	{@render children?.({
		value,
		name,
		required,
		ariaRequired: required,
		class: { 'input-error': fieldError },
		id: uid + name,
		placeholder
	})}

	{#if fieldError}
		<span class="text-error first-letter:capitalize">{fieldError}</span>
	{:else}
		<span {...attributes?.hint} class="input-hint {attributes?.hint?.class}">{hint}</span>
	{/if}
</div>
