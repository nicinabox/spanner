<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import FormField, { type FormFieldProps } from './FormField.svelte';
	let props: FormFieldProps<HTMLTextareaAttributes> = $props();
</script>

<FormField {...props}>
	{#snippet children(field)}
		<textarea {...field} class={['textarea', field.class]}></textarea>
	{/snippet}
</FormField>
