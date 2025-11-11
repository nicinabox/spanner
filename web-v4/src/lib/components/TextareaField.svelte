<script lang="ts">
	import FormField, { type FormFieldProps } from './FormField.svelte';
	let props: FormFieldProps = $props();
</script>

<FormField {...props}>
	{#snippet children(field)}
		<textarea {...field} class={['input', field.class]}>
			{field.value}
		</textarea>
	{/snippet}
</FormField>
