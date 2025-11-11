<script lang="ts">
	import { findFieldError, type FormAction } from '$lib/utils/form';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface FormControlProps {
		value: unknown;
		name: string;
		class: HTMLAttributes<EventTarget>['class'];
		required: boolean | undefined;
		ariaRequired: boolean | undefined;
	}

	export type FormFieldProps<ExtraProps = object> = {
		form: FormAction;
		name: string;
		label?: string;
		hint?: string;
		value?: unknown;
		class?: HTMLAttributes<EventTarget>['class'];
		required?: boolean;
		children?: Snippet<[FormControlProps & ExtraProps]>;
	} & ExtraProps;

	let { children, form, name, label, hint, value, required, ...props }: FormFieldProps = $props();

	let fieldError = findFieldError(name, form);
</script>

<div class="mb-4 flex flex-col gap-1" {...props}>
	<label class="label text-sm text-base-content" for={name}>
		{label}
		{#if required}<span class="text-red-400">*</span>{/if}
	</label>

	{@render children?.({
		value,
		name,
		required,
		ariaRequired: required,
		class: { 'input-error': fieldError }
	})}

	{#if fieldError}
		<span class="text-error first-letter:capitalize">{fieldError}</span>
	{:else}
		<span class="label">{hint}</span>
	{/if}
</div>
