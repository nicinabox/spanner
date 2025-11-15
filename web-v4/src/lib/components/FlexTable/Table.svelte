<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();
</script>

<div class="flex w-full flex-col flex-nowrap pb-2 sm:table {className}">
	{@render children()}
</div>
