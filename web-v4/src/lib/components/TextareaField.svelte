<script lang="ts">
	import FormField from './FormField.svelte';
	import type { ComponentProps } from 'svelte';
	import Textarea from './ui/Textarea.svelte';

	type FormFieldProps = Omit<ComponentProps<typeof FormField>, 'children'>;
	type TextareaProps = ComponentProps<typeof Textarea>;
	type Props = FormFieldProps & TextareaProps;

	let { label, hint, errors, name, required, id, value = $bindable(''), ...rest }: Props = $props();
</script>

<FormField {label} {hint} {errors} {required} {id} {name} {...rest}>
	<Textarea bind:value />
</FormField>
