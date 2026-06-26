<script lang="ts">
	import { Button, Card } from '$lib';
	import FileInput from '$lib/components/forms/FileInput.svelte';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import { page } from '$app/stores';
	import { Download } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { vehiclePath } from '$lib/routes';
	import { pageTitle } from '$lib/utils/site';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);

	let selectedFile = $state<File | null>(null);

	let activeTab = $derived(
		$page.url.pathname === `/vehicles/${vehicle.id}/transfer` ? 'history' : 'history',
	);
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
			<Button href={`/vehicles/${vehicle.id}/export`} class="self-start">
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

			<form
				method="POST"
				action={`/vehicles/${vehicle.id}/import`}
				enctype="multipart/form-data"
				class="space-y-4"
			>
				<label class="flex items-center gap-3 cursor-pointer">
					<FileInput
						name="file"
						accept=".csv"
						onChange={(input) => (selectedFile = input.files?.[0] ?? null)}
					/>
					<span class="text-sm text-ink-400">
						{selectedFile ? selectedFile.name : 'No file chosen'}
					</span>
				</label>
				<Button type="submit">Import</Button>
			</form>
		</Card>
	</div>
</VehiclePageLayout>
