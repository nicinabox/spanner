<script lang="ts">
	import { pageTitle } from '$lib/utils/site';
</script>

<svelte:head>
	<title>{pageTitle('Offline')}</title>
</svelte:head>

<main class="max-w-2xl w-full mx-auto px-4">
	<div class="flex min-h-screen flex-col items-center justify-center">
		<h1 class="text-2xl font-bold">You're offline</h1>
		<p class="mt-2 text-lg text-ink-500">Connect to the internet to view your vehicles.</p>
	</div>
</main>
