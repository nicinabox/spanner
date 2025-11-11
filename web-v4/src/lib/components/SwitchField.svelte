<script lang="ts">
	import FormField, { type FormFieldProps } from './FormField.svelte';
	let props: FormFieldProps<{
		value?: boolean;
	}> = $props();
</script>

<FormField {...props}>
	{#snippet children(field)}
		<input type="checkbox" {...field} class={['toggle', field.class]} />
	{/snippet}
</FormField>
