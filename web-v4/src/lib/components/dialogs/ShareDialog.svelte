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
				<Clipboard value={shareUrl} />
				<Button type="submit" variant="outline" color="danger" class="self-start mt-2"
					>Stop Sharing</Button
				>
			</div>
		{:else}
			<div class="mt-4">
				<Button type="submit" variant="solid">Enable Sharing</Button>
			</div>
		{/if}
	</form>
</Dialog>
