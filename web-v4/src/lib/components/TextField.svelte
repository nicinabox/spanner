<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FormField, { type FormFieldProps } from './FormField.svelte';
	import Input from './ui/Input.svelte';
	let { type = 'text', ...props }: FormFieldProps<HTMLInputAttributes> = $props();
</script>

<FormField {...props}>
	{#snippet children(field)}
		<Input {type} {...field} class={['w-full', field.class]} />
	{/snippet}
</FormField>
