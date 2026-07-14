<script lang="ts">
	import { Button, Card, Switch, ErrorSummary } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import FileInput from '$lib/components/common/FileInput.svelte';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import { page } from '$app/state';
	import { Download, TriangleAlert } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { vehiclePath } from '$lib/routes';
	import { pageTitle } from '$lib/utils/site';
	import { exportVehicle } from '$lib/data/vehicles.remote';

	let { data, form }: PageProps = $props();

	let vehicle = $derived(data.vehicle);

	let selectedFile = $state<File | null>(null);

	let activeTab = $derived(
		page.url.pathname === `/vehicles/${vehicle.id}/transfer` ? 'history' : 'history',
	);

	let formErrors = $derived(form?.errors ?? []);
</script>

<svelte:head>
	<title>{pageTitle('Import/Export', data.vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout
	{vehicle}
	{activeTab}
	backAction={{
		href: vehiclePath(vehicle.id),
		label: 'Back',
	}}
>
	<div class="max-w-2xl mx-auto space-y-6">
		<Card bleed variant="outline">
			<h2 class="text-lg font-semibold">Export History</h2>
			<p>Download your vehicle's complete history as a CSV file.</p>
			<Button
				onclick={() =>
					exportVehicle({ vehicleId: String(vehicle.id) }).then((csv) => {
						const blob = new Blob([csv], { type: 'text/csv' });
						const url = URL.createObjectURL(blob);
						const a = document.createElement('a');
						a.href = url;
						a.download = `${vehicle.name}.csv`;
						a.click();
						URL.revokeObjectURL(url);
					})}
				class="self-start"
				{...umamiEvent('export_csv')}
			>
				<Download size={16} />
				Export CSV
			</Button>
		</Card>

		<Card bleed variant="outline">
			<h2 class="text-lg font-semibold">Import History</h2>
			<p>Upload a CSV file to import records.</p>
			<div>
				<p class="font-medium">CSV format:</p>
				<div class="rounded-md bg-ink-100 p-4 text-base space-y-1 font-mono">
					<code class="block">date,cost,mileage,notes</code>
					<code class="block">2024-01-15,45.00,52500,"Oil change"</code>
					<code class="block">2024-06-20,,54200,"Tire rotation"</code>
				</div>
			</div>

			<ErrorSummary {formErrors} />

			<form method="POST" action="?/import" enctype="multipart/form-data" class="space-y-4">
				<label class="flex items-center gap-3 cursor-pointer">
					<FileInput
						name="importFile"
						accept=".csv"
						onChange={(input) => (selectedFile = input.files?.[0] ?? null)}
					/>
					<span class="text-sm text-ink-400">
						{selectedFile ? selectedFile.name : 'No file chosen'}
					</span>
				</label>

				<Switch name="fuelly" value="true">This data is from Fuelly</Switch>

				<div class="flex items-start gap-2 p-3 rounded-md bg-warning/10 text-warning text-sm">
					<TriangleAlert size={16} class="mt-0.5 shrink-0" />
					<span>This will replace all your existing records for this vehicle!</span>
				</div>

				<Button type="submit" {...umamiEvent('import_csv')}>Import</Button>
			</form>
		</Card>
	</div>
</VehiclePageLayout>
