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

<dialog
	class="backdrop:bg-black/30 backdrop:backdrop-blur-[2px] open:opacity-100 open:transition-opacity"
	bind:this={ref}
>
	<form method="dialog" class="fixed inset-0 flex min-h-full items-center justify-center p-4">
		<button class="absolute inset-0 cursor-default" type="submit" aria-label="Close"></button>

		<div class="relative w-full max-w-md rounded-lg bg-popover p-6 shadow-lg">
			<h3 class="mb-6 text-lg font-bold">{title}</h3>

			<div class="my-4">
				{@render children()}
			</div>

			{#if actions}
				<div class="mt-6 flex justify-end gap-2">
					{@render actions()}
				</div>
			{/if}
		</div>
	</form>
</dialog>
