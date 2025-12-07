<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();
</script>

<div class="flex flex-nowrap justify-start px-4 sm:table-cell sm:py-2.5 {className}">
	{@render children?.()}
</div>
