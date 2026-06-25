<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
		class?: string;
	}

	let { children, class: className, ...props }: Props = $props();
</script>

<div {...props} class="flex w-full flex-col flex-nowrap rounded-none pb-2 sm:table {className}">
	{@render children()}
</div>
