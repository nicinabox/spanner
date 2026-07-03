<script lang="ts">
	import { Card } from '$lib';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import MileageAdjustmentForm from '$lib/components/forms/MileageAdjustmentForm.svelte';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import ReminderForm from '$lib/components/forms/ReminderForm.svelte';
	import ServiceScheduleForm from '$lib/components/forms/ServiceScheduleForm.svelte';
	import { page } from '$app/stores';
	import { Bell, Gauge, PlusIcon, Wrench } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';
	import { mileageLabel } from '$lib/utils/vehicle';

	let { data, form }: PageProps = $props();

	let vehicle = $derived(data.vehicle);

	let view = $derived(($page.url.searchParams.get('view') as string | null) ?? 'record');
	let notesParam = $derived($page.url.searchParams.get('notes') ?? '');

	let title = $derived(
		{
			record: 'New Record',
			reminder: 'New Reminder',
			schedule: 'New Schedule',
			'mileage-adjustment': 'Adjust Mileage',
		}[view] ?? 'New Record',
	);

	let tabs = $derived([
		{
			value: 'record',
			label: 'New Record',
			href: `/vehicles/${vehicle.id}/add?view=record`,
			icon: PlusIcon,
		},
		{
			value: 'reminder',
			label: 'New Reminder',
			href: `/vehicles/${vehicle.id}/add?view=reminder`,
			icon: Bell,
		},
		{
			value: 'schedule',
			label: 'New Schedule',
			href: `/vehicles/${vehicle.id}/add?view=schedule`,
			icon: Wrench,
		},
		{
			value: 'mileage-adjustment',
			label: 'Adjust Mileage',
			href: `/vehicles/${vehicle.id}/add?view=mileage-adjustment`,
			icon: Gauge,
		},
	]);
</script>

<svelte:head>
	<title>{pageTitle('Add Record', data.vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout
	{vehicle}
	{tabs}
	activeTab={view}
	backAction={{ href: `/vehicles/${vehicle.id}`, label: 'Back' }}
>
	<div class="max-w-2xl mx-auto">
		<Card variant="outline" bleed>
			<h1 class="text-xl font-semibold">{title}</h1>

			{#if view === 'record'}
				<RecordForm {vehicle} record={{ notes: notesParam } as any} action="?/record" />
			{:else if view === 'reminder'}
				<ReminderForm {vehicle} action="?/reminder" errors={form?.errors} />
			{:else if view === 'schedule'}
				<ServiceScheduleForm {vehicle} classifications={data.classifications ?? []} />
			{:else if view === 'mileage-adjustment'}
				<p>
					Correct your {mileageLabel(vehicle.distanceUnit)} estimate when you haven't had recent service
					and the estimate is off significantly from actual {mileageLabel(vehicle.distanceUnit)}.
				</p>
				<MileageAdjustmentForm {vehicle} action="?/mileage-adjustment" />
			{/if}
		</Card>
	</div>
</VehiclePageLayout>
