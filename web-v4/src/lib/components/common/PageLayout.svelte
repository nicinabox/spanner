<script lang="ts">
	import { page } from '$app/stores';
	import AppBar from './AppBar.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		header?: Snippet;
		children: Snippet;
	}

	let { header, children }: Props = $props();

	let session = $derived($page.data.session);
</script>

<AppBar {session}>
	{#snippet start()}
		{#if header}
			{@render header()}
		{/if}
	{/snippet}
</AppBar>

<div class="py-6 px-(--main-padding)">
	<div class="w-full mx-auto">
		{@render children()}
	</div>
</div>
