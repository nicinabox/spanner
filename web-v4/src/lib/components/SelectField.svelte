<script lang="ts">
	import FormField, { type FormFieldProps } from './FormField.svelte';

	let {
		options,
		...props
	}: FormFieldProps<{
		options: { value: string; label: string }[];
	}> = $props();
</script>

<FormField {...props}>
	{#snippet children(field)}
		<select {...field} class={['select', 'w-full', field.class]}>
			{#each options as { value, label }, i (i)}
				<option {value}>{label}</option>
			{/each}
		</select>
	{/snippet}
</FormField>
