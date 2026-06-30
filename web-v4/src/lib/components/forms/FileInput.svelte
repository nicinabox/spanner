<script lang="ts">
	import { Paperclip } from 'lucide-svelte';
	import Button from '$lib/components/common/Button.svelte';
	import type { ButtonVariant, ButtonSize } from '$lib/components/common/Button.svelte';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		/** Form field name (e.g. "record[attachments][]", "file"). Required. */
		name: string;
		/** Optional accept attribute (e.g. ".csv", "image/*"). */
		accept?: string;
		/** Allow multiple file selection. */
		multiple?: boolean;
		/** Controlled FileList. Bind with `bind:files` on the call site. */
		files?: FileList | null;
		/** Change handler — receives the input element so caller can read .files / reset .value. */
		onChange?: (input: HTMLInputElement) => void;
		/** Button label. Default: "Choose file" (or "Choose files" when multiple). */
		buttonLabel?: string;
		/** Button variant. Default: "outline". */
		buttonVariant?: ButtonVariant;
		/** Button size. Default: "sm". */
		buttonSize?: ButtonSize;
		/** Extra classes for the wrapping div. */
		class?: ClassValue;
	}

	let {
		name,
		accept,
		multiple = false,
		files = $bindable(null),
		onChange,
		buttonLabel,
		buttonVariant = 'outline',
		buttonSize = 'sm',
		class: className,
	}: Props = $props();

	let inputEl: HTMLInputElement | undefined = $state();

	let label = $derived(buttonLabel ?? (multiple ? 'Choose files' : 'Choose file'));

	function handleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		onChange?.(input);
	}
</script>

<div class={['inline-flex', className]}>
	<Button variant={buttonVariant} size={buttonSize} type="button" onclick={() => inputEl?.click()}>
		<Paperclip size={16} />
		{label}
	</Button>
	<input
		bind:this={inputEl}
		bind:files
		type="file"
		{name}
		{accept}
		{multiple}
		class="hidden"
		onchange={handleChange}
	/>
</div>
