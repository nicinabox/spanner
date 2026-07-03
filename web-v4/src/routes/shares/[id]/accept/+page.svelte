<script lang="ts">
	import AppBar from '$lib/components/common/AppBar.svelte';
	import { Button, Card } from '$lib';
	import { pageTitle } from '$lib/utils/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{pageTitle('Accept Invite')}</title>
</svelte:head>

<AppBar />

<div class="max-w-2xl mx-auto px-(--main-padding) py-6">
	{#if data.status === 'expired'}
		<Card>
			<h1 class="text-xl font-semibold mb-2">Invite Not Found</h1>
			<p class="text-ink-400">This invite may have expired or been revoked.</p>
		</Card>
	{:else}
		<Card>
			<h1 class="text-xl font-semibold mb-2">Vehicle Invite</h1>
			<p class="text-ink-400 mb-4">
				{data.share.invited_by?.email} invited you to access
				<strong>{data.share.vehicle?.name}</strong>.
			</p>
			<form method="POST" action="?/accept">
				<Button type="submit">Accept Invite</Button>
			</form>
		</Card>
	{/if}
</div>
