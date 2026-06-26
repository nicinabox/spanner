<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import Badge from '$lib/components/common/Badge.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://rsms.me" />
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
	<link rel="icon" type="image/png" href={favicon} />
	{import.meta.env.HEAD_INJECTIONS}
</svelte:head>

<div class="min-h-screen flex flex-col">
	{@render children()}

	<footer class="flex items-center justify-between text-sm py-4 px-(--main-padding) mt-auto">
		<a href="/legal">Legal</a>
		<Badge>{__APP_VERSION__}</Badge>
	</footer>
</div>
