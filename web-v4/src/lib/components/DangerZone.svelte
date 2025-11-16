<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<h2 class="mb-4 font-bold text-error">Danger Zone</h2>
<div class="flex flex-col gap-8">
	{@render children()}
</div>
