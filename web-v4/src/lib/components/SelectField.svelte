<script lang="ts">
	import FormField, { type FormFieldProps } from './FormField.svelte';
	import NativeSelect from './ui/NativeSelect.svelte';

	let {
		options,
		...props
	}: FormFieldProps<{
		options: { value: string; label: string }[];
	}> = $props();
</script>

<FormField {...props}>
	{#snippet children(field)}
		<NativeSelect {...field} class={['w-full', field.class]}>
			{#each options as { value, label }, i (i)}
				<option {value}>{label}</option>
			{/each}
		</NativeSelect>
	{/snippet}
</FormField>
