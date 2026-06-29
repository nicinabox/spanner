<script lang="ts">
	import '../app.css';
	import { version } from '$app/environment';
	import Badge from '$lib/components/common/Badge.svelte';

	let { children } = $props();
</script>

<svelte:head>
	{__HEAD_INJECTIONS__}
</svelte:head>

<div class="min-h-screen flex flex-col">
	{@render children()}

	<footer
		class="flex items-center justify-between text-sm py-4 px-(--main-padding) mt-auto"
		style="padding-bottom: calc(1rem + env(safe-area-inset-bottom))"
	>
		<a href="/legal">Legal</a>
		<Badge>{version}</Badge>
	</footer>
</div>
