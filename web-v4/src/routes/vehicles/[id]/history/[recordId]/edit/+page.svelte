<script lang="ts">
	import { Button, Card, Confirm } from '$lib';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import { page } from '$app/stores';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let record = $derived(data.record);

	let activeTab = $derived(
		$page.url.pathname === `/vehicles/${vehicle.id}/history/${record.id}/edit` ? 'history' : 'history'
	);
</script>

<VehiclePageLayout
	{vehicle}
	{activeTab}
	backAction={{ href: `/vehicles/${vehicle.id}`, label: 'Back' }}
>
	<div class="max-w-2xl mx-auto">
		<Card variant="outline" bleed>
			<h1 class="text-xl font-semibold">Edit Record</h1>
			<RecordForm {vehicle} {record} />
		</Card>

		<Card class="mt-6" variant="outline" bleed>
			<h1 class="text-xl">Danger Zone</h1>

			<fieldset>
				<label class="flex items-center justify-between gap-3 cursor-pointer">
					<div>
						<span class="font-medium">Permanently delete</span>
						<p class="text-sm text-ink-500">
							This record will be permanently deleted.
						</p>
					</div>
					<Confirm title="Delete record?">
						{#snippet trigger({ onOpenChange })}
							<Button danger onclick={() => onOpenChange(true)}>Delete</Button>
						{/snippet}
						{#snippet actions({ onOpenChange })}
							<Button type="submit" danger size="lg" class="flex-1">Delete</Button>
							<Button variant="outline" size="lg" class="flex-1" onclick={() => onOpenChange(false)}>
								Cancel
							</Button>
						{/snippet}
						<form method="POST" action="?/delete">
							<p>
								This record will be permanently deleted.
							</p>
						</form>
					</Confirm>
				</label>
			</fieldset>
		</Card>
	</div>
</VehiclePageLayout>
