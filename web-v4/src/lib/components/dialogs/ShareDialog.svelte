<script lang="ts">
	import { Button, Clipboard, Dialog, Input } from '$lib';
	import { page } from '$app/stores';
	import { browser } from '$app/env';
	import type { Vehicle } from '$lib/data/vehicles';
	import { createShare, getShares, deleteShare } from '$lib/data/shares.remote';
	import { createShareLink, getShareLinks, deleteShareLink } from '$lib/data/share-links.remote';
	import { X, Link, Mail, Check, Clock } from 'lucide-svelte';

	interface Props {
		vehicle: Vehicle;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}

	let { vehicle, open = $bindable(false), onOpenChange }: Props = $props();

	let shares = $state<Awaited<ReturnType<typeof getShares>>>([]);
	let shareLinks = $state<Awaited<ReturnType<typeof getShareLinks>>>([]);
	let email = $state('');
	let inviteError = $state('');
	let loading = $state(false);

	let loaded = false;

	$effect(() => {
		if (open && browser && !loaded) {
			loaded = true;
			loadShares();
			loadShareLinks();
		}
	});

	$effect(() => {
		if (!open) {
			loaded = false;
		}
	});

	async function loadShares() {
		try {
			shares = await getShares({ vehicleId: vehicle.id });
		} catch {
			shares = [];
		}
	}

	async function loadShareLinks() {
		try {
			shareLinks = await getShareLinks({ vehicleId: vehicle.id });
		} catch {
			shareLinks = [];
		}
	}

	async function handleInvite() {
		if (!email.trim()) return;
		inviteError = '';
		loading = true;
		try {
			await createShare({ vehicleId: vehicle.id, email: email.trim() });
			email = '';
			await loadShares();
		} catch (e: any) {
			inviteError = e.message || 'Failed to send invite';
		} finally {
			loading = false;
		}
	}

	async function handleRevoke(shareId: number) {
		await deleteShare({ vehicleId: vehicle.id, shareId });
		await loadShares();
	}

	async function handleCreateLink() {
		loading = true;
		try {
			await createShareLink({ vehicleId: vehicle.id });
			await loadShareLinks();
		} finally {
			loading = false;
		}
	}

	async function handleRevokeLink(linkId: number) {
		await deleteShareLink({ vehicleId: vehicle.id, linkId });
		await loadShareLinks();
	}
</script>

<Dialog bind:open title="Share Vehicle">
	<div class="space-y-6">
		<!-- Invite People -->
		<section>
			<h3 class="text-sm font-semibold flex items-center gap-2 mb-3">
				<Mail size={16} />
				Invite People
			</h3>

			<form
				class="flex gap-2"
				onsubmit={(e) => {
					e.preventDefault();
					handleInvite();
				}}
			>
				<Input
					type="email"
					placeholder="Email address..."
					bind:value={email}
					class="flex-1"
					required
				/>
				<Button type="submit" disabled={loading || !email.trim()}>Invite</Button>
			</form>

			{#if inviteError}
				<p class="text-sm text-negative mt-1">{inviteError}</p>
			{/if}

			{#if shares.length > 0}
				<ul class="mt-3 space-y-1">
					{#each shares as share}
						<li class="flex items-center justify-between text-sm py-1">
							<span class="flex items-center gap-2">
								{share.user?.email ?? 'Unknown'}
								{#if share.accepted_at}
									<Check size={14} class="text-positive" />
								{:else}
									<Clock size={14} class="text-ink-400" />
									<span class="text-ink-400">Pending</span>
								{/if}
							</span>
							<button
								onclick={() => handleRevoke(share.id)}
								class="text-negative hover:underline text-sm"
							>
								<X size={14} />
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</section>

		<hr class="border-ink-200" />

		<!-- Public Links -->
		<section>
			<h3 class="text-sm font-semibold flex items-center gap-2 mb-3">
				<Link size={16} />
				Public Links
			</h3>

			<Button onclick={handleCreateLink} variant="outline" size="sm" disabled={loading}>
				Create Link
			</Button>

			{#if shareLinks.length > 0}
				<ul class="mt-3 space-y-2">
					{#each shareLinks as link}
						<li class="flex items-center gap-2">
							<Clipboard
								value={`${$page.url.origin}/share/vehicles/${link.token}`}
							/>
							<button
								onclick={() => handleRevokeLink(link.id)}
								class="text-negative hover:underline text-sm shrink-0"
							>
								<X size={14} />
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</Dialog>
