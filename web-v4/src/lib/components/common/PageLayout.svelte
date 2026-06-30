<script lang="ts">
	import { page } from '$app/stores';
	import AppBar from './AppBar.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		appbarStart?: Snippet;
		appbarCenter?: Snippet;
		appbarEnd?: Snippet;
		appbarClass?: string;
		children: Snippet;
	}

	let {
		appbarStart: start,
		appbarCenter: center,
		appbarEnd: end,
		appbarClass,
		children,
	}: Props = $props();

	let session = $derived($page.data.session);
</script>

<AppBar {session} {start} {center} {end} class={appbarClass} />

<div class="py-6 px-(--main-padding)">
	<div class="w-full mx-auto">
		{@render children()}
	</div>
</div>
