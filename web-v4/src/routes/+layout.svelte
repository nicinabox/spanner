<script lang="ts">
	import '../app.css';
	import Badge from '$lib/components/common/Badge.svelte';

	let { children } = $props();
</script>

<svelte:head>
	{import.meta.env.HEAD_INJECTIONS}
</svelte:head>

<div class="min-h-screen flex flex-col">
	{@render children()}

	<footer
		class="flex items-center justify-between text-sm py-4 px-(--main-padding) mt-auto"
		style="padding-bottom: calc(1rem + env(safe-area-inset-bottom))"
	>
		<a href="/legal">Legal</a>
		<Badge>{__APP_VERSION__}</Badge>
	</footer>
</div>
