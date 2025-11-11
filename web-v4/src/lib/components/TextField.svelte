<script lang="ts">
	import FormField, { type FormFieldProps } from './FormField.svelte';
	let props: FormFieldProps = $props();
</script>

<FormField {...props}>
	{#snippet children(field)}
		<input type="text" {...field} class={['input', field.class]} />
	{/snippet}
</FormField>
