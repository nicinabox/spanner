<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();
</script>

<div class="flex flex-col flex-nowrap justify-start px-2 sm:table-cell sm:px-4 sm:py-2 {className}">
	{@render children()}
</div>
