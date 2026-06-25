<script lang="ts">
	import { Button, Card } from '$lib';
	import FileInput from '$lib/components/forms/FileInput.svelte';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import { page } from '$app/stores';
	import { Download } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { vehiclePath } from '$lib/routes';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);

	let selectedFile = $state<File | null>(null);

	let activeTab = $derived(
		$page.url.pathname === `/vehicles/${vehicle.id}/transfer` ? 'history' : 'history',
	);
</script>

<VehiclePageLayout
	{vehicle}
	{activeTab}
	backAction={{
		href: vehiclePath(vehicle.id),
		label: 'Back',
	}}
>
	<div class="max-w-2xl mx-auto space-y-6">
		<Card bleed>
			<h2 class="text-lg font-semibold">Export History</h2>
			<p>Download your vehicle's complete history as a CSV file.</p>
			<Button href={`/vehicles/${vehicle.id}/export`} class="self-start">
				<Download size={16} />
				Export CSV
			</Button>
		</Card>

		<Card bleed>
			<h2 class="text-lg font-semibold">Import History</h2>
			<p>Upload a CSV file to import records. The file must match the export format.</p>
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
