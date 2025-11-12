<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FormField, { type FormFieldProps } from './FormField.svelte';
	let { type = 'text', ...props }: FormFieldProps<HTMLInputAttributes> = $props();
</script>

<FormField {...props}>
	{#snippet children(field)}
		<input {type} {...field} class={['input', field.class]} />
	{/snippet}
</FormField>
