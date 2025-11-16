<script lang="ts">
	import type { Snippet } from 'svelte';
	import Dialog, { type DialogProps } from './Dialog.svelte';

	interface Props extends Omit<DialogProps, 'ref'> {
		button: Snippet<[HTMLDialogElement]>;
	}

	let { button, ...props }: Props = $props();

	// svelte-ignore non_reactive_update
	let ref: HTMLDialogElement;
</script>

<Dialog {...props} bind:ref />

{@render button(ref)}
