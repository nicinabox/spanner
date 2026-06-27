<script lang="ts">
	import '../app.css';
	import Badge from '$lib/components/common/Badge.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://rsms.me" />
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

	<link
		rel="icon"
		type="image/png"
		href="/icons/favicon-32.png"
		sizes="32x32"
		media="(prefers-color-scheme: light)"
	/>
	<link
		rel="icon"
		type="image/png"
		href="/icons/favicon-16.png"
		sizes="16x16"
		media="(prefers-color-scheme: light)"
	/>

	<link
		rel="icon"
		type="image/png"
		href="/icons/favicon-white-32.png"
		sizes="32x32"
		media="(prefers-color-scheme: dark)"
	/>
	<link
		rel="icon"
		type="image/png"
		href="/icons/favicon-white-16.png"
		sizes="16x16"
		media="(prefers-color-scheme: dark)"
	/>
	{import.meta.env.HEAD_INJECTIONS}
</svelte:head>

<div class="min-h-screen flex flex-col">
	{@render children()}

	<footer class="flex items-center justify-between text-sm py-4 px-(--main-padding) mt-auto">
		<a href="/legal">Legal</a>
		<Badge>{__APP_VERSION__}</Badge>
	</footer>
</div>
