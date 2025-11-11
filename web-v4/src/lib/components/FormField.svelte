<script lang="ts">
	interface Props {
		form: { errors?: Record<string, string> } | null;
		name: string;
		label?: string;
		hint?: string;
		type?: string;
		value?: string | number | null;
	}

	let { form, name, label, hint, type = 'text', value }: Props = $props();
	let inputError = form?.errors?.[name];
</script>

<div class="mb-4 flex flex-col gap-1">
	<label class="label text-sm text-base-content" for={name}>{label}</label>
	<input {name} {type} class="input" class:input-error={inputError} {value} />

	{#if inputError}
		<span class="text-error first-letter:capitalize">{inputError}</span>
	{:else}
		<span class="label">{hint}</span>
	{/if}
</div>
