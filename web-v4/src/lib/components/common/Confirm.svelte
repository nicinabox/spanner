<script lang="ts">
	import type { Snippet } from 'svelte';
	import Dialog from './Dialog.svelte';

	interface Props {
		children: Snippet;
		title?: string;
		trigger?: Snippet<[{ open: boolean; onOpenChange: (open: boolean) => void }]>;
		actions?: Snippet<[{ open: boolean; onOpenChange: (open: boolean) => void }]>;
		modal?: boolean;
		closeOnEscape?: boolean;
		closeOnInteractOutside?: boolean;
		id?: string;
	}

	let {
		children,
		title,
		trigger,
		actions,
		modal = true,
		closeOnEscape = true,
		closeOnInteractOutside = true,
		id: idProp,
	}: Props = $props();

	let open = $state(false);
	let id = $props.id();
	let resolvedId = $derived(idProp ?? id);

	function onOpenChange(val: boolean) {
		open = val;
	}
</script>

{#if trigger}
	{@render trigger({ open, onOpenChange })}
{/if}

<Dialog bind:open {title} {modal} {closeOnEscape} {closeOnInteractOutside} id={resolvedId}>
	{@render children()}

	{#if actions}
		<div class="mt-6 flex flex-col sm:flex-row sm:justify-end gap-2">
			{@render actions({ open, onOpenChange })}
		</div>
	{/if}
</Dialog>
