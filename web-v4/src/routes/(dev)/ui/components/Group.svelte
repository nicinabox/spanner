<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title?: string;
		children?: Snippet;
	};

	let { title, children }: Props = $props();
</script>

<div class="my-6">
	{#if title}
		<h2 class="font-semibold text-xl mb-2">{title}</h2>
	{/if}

	<div class="flex flex-col gap-2 items-start">
		{@render children?.()}
	</div>
</div>
