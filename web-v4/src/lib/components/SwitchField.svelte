<script lang="ts">
	import FormField, { type FormFieldProps } from './FormField.svelte';
	let props: FormFieldProps<{
		value?: boolean;
	}> = $props();

	let checked = $derived(Boolean(props.value));
</script>

<FormField
	{...props}
	class="grid min-w-0 grid-cols-[auto_1fr] gap-x-4 {props.class}"
	attributes={{
		hint: {
			class: 'text-sm whitespace-wrap'
		}
	}}
>
	{#snippet children({ name, ...field })}
		<input type="hidden" {name} {...field} value={checked} />
		<input
			type="checkbox"
			bind:checked
			class={['toggle toggle-success', 'row-span-2 self-center justify-self-end', field.class]}
		/>
	{/snippet}
</FormField>
