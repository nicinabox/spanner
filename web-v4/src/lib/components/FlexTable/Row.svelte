<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();
</script>

<div class="flex flex-row flex-wrap max-sm:py-1 sm:table-row sm:flex-nowrap {className}">
	{@render children()}
</div>
