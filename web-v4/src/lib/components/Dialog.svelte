<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface DialogProps {
		title: string;
		children: Snippet;
		actions: Snippet;
		ref: HTMLDialogElement;
	}

	let { title, children, actions, ref = $bindable() }: DialogProps = $props();
</script>

<dialog class="modal" bind:this={ref}>
	<div class="modal-box">
		<h3 class="mb-6 text-lg font-bold">{title}</h3>

		<div class="my-4">
			{@render children()}
		</div>

		{#if actions}
			<div class="modal-action">
				{@render actions()}
			</div>
		{/if}
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
