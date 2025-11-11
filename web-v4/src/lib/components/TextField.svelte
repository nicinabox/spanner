<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FormField, { type FormFieldProps } from './FormField.svelte';
	let props: FormFieldProps<HTMLInputAttributes> = $props();
</script>

<FormField {...props}>
	{#snippet children(field)}
		<input type="text" {...field} class={['input', field.class]} />
	{/snippet}
</FormField>
