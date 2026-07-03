<script lang="ts">
	import AppBar from '$lib/components/common/AppBar.svelte';
	import { Button, Card } from '$lib';
	import { acceptShare, declineShare } from '$lib/data/shares';
	import { invalidateAll } from '$app/navigation';
	import { pageTitle } from '$lib/utils/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let shares = $state(data.shares);

	async function handleAccept(shareId: number) {
		await acceptShare(shareId, {});
		shares = shares.filter((s) => s.id !== shareId);
		await invalidateAll();
	}

	async function handleDecline(shareId: number) {
		await declineShare(shareId, {});
		shares = shares.filter((s) => s.id !== shareId);
	}
</script>

<svelte:head>
	<title>{pageTitle('Pending Invites')}</title>
</svelte:head>

<AppBar />

<div class="max-w-2xl mx-auto px-(--main-padding) py-6">
	<h1 class="text-2xl font-semibold mb-6">Pending Invites</h1>

	{#if shares.length === 0}
		<p class="text-ink-400">No pending invites.</p>
	{:else}
		<div class="space-y-3">
			{#each shares as share}
				<Card>
					<div class="flex items-center justify-between">
						<div>
							<p class="font-medium">{share.vehicle?.name ?? 'Unknown vehicle'}</p>
							<p class="text-sm text-ink-400">
								Invited by {share.invited_by?.email ?? 'Unknown'}
							</p>
						</div>
						<div class="flex gap-2">
							<Button onclick={() => handleDecline(share.id)} variant="outline" color="danger">
								Decline
							</Button>
							<Button onclick={() => handleAccept(share.id)}>Accept</Button>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
