<script lang="ts">
	import { Button, Card } from '$lib';
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
		<Card variant="outline">
			<h1 class="text-xl font-semibold">Edit Record</h1>
			<RecordForm {vehicle} {record} />
		</Card>

		<div class="mt-6">
			<form method="POST" action="?/delete">
				<Button variant="tertiary" danger type="submit">Delete Record</Button>
			</form>
		</div>
	</div>
</VehiclePageLayout>
