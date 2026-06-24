<script lang="ts">
	import { Button, Clipboard, Dialog } from '$lib';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { Vehicle } from '$lib/data/vehicles';
	import { enhanceInline } from '$lib/utils/form';

	interface Props {
		vehicle: Vehicle;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}

	let { vehicle, open = $bindable(false), onOpenChange }: Props = $props();

	let shareUrl = $derived(`${$page.url.origin}/share/vehicles/${vehicle.id}`);
</script>

<Dialog bind:open title="Share">
	<p>Sharing will enable anyone with the link to view.</p>

	<form method="POST" action={`/vehicles/${vehicle.id}?/toggleShare`} use:enhance={enhanceInline}>
		{#if vehicle.preferences.enableSharing}
			<div class="mt-4 flex flex-col gap-3">
				<label class="text-sm font-medium text-ink-700" for="share-url">Link</label>
				<div class="flex gap-2">
					<input
						id="share-url"
						readonly
						value={shareUrl}
						class="flex-1 rounded-md border border-ink-200 bg-ink-50 px-3 py-2 text-sm"
					/>
					<Clipboard value={shareUrl} />
				</div>
				<Button type="submit" size="lg" variant="primary" danger class="self-start mt-2">
					Stop Sharing
				</Button>
			</div>
		{:else}
			<div class="mt-4">
				<Button type="submit" size="lg" variant="primary">Enable Sharing</Button>
			</div>
		{/if}
	</form>
</Dialog>
