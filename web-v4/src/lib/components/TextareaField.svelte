<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import FormField, { type FormFieldProps } from './FormField.svelte';
	import Textarea from './ui/Textarea.svelte';
	let props: FormFieldProps<HTMLTextareaAttributes> = $props();
</script>

<FormField {...props}>
	{#snippet children(field)}
		<Textarea {...field} class={['w-full', field.class]}></Textarea>
	{/snippet}
</FormField>
