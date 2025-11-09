<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex w-full flex-col flex-nowrap py-2 sm:table">
	{@render children()}
</div>
