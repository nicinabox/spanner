<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let isError = $derived(data.message.includes("Couldn't") || data.message.includes('Invalid'));
</script>

<svelte:head>
	<title>Unsubscribe — Spanner</title>
</svelte:head>

<div class="flex min-h-screen max-w-prose mx-auto flex-col items-center justify-center px-4">
	<div class="text-center">
		<img src="/logo.png" alt="Spanner" class="h-14 w-auto mx-auto block dark:hidden" />
		<img src="/logo-white.png" alt="Spanner" class="h-14 w-auto mx-auto hidden dark:block" />
		<h1 class="text-2xl font-semibold mt-6 mb-2">{isError ? 'Something went wrong' : 'Unsubscribed'}</h1>
		<p class="text-lg text-ink-500">{data.message}</p>
	</div>
</div>
