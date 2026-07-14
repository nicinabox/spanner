<script lang="ts">
	import { Card, SegmentedControl } from '$lib';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import MileageAdjustmentForm from '$lib/components/forms/MileageAdjustmentForm.svelte';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import ReminderForm from '$lib/components/forms/ReminderForm.svelte';
	import TaskForm from '$lib/components/forms/TaskForm.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { PlusIcon, Gauge, Wrench } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';
	import { mileageLabel } from '$lib/utils/vehicle';

	let { data, form }: PageProps = $props();

	let vehicle = $derived(data.vehicle);

	let view = $derived((page.url.searchParams.get('view') as string | null) ?? 'record');
	let type = $derived((page.url.searchParams.get('type') as string | null) ?? 'task');
	let notesParam = $derived(page.url.searchParams.get('notes') ?? '');

	let title = $derived(
		{
			record: 'New Record',
			tasks: type === 'task' ? 'New Task' : 'New Reminder',
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
			value: 'tasks',
			label: 'New Task',
			href: `/vehicles/${vehicle.id}/add?view=tasks&type=task`,
			icon: Wrench,
		},
		{
			value: 'mileage-adjustment',
			label: 'Adjust Mileage',
			href: `/vehicles/${vehicle.id}/add?view=mileage-adjustment`,
			icon: Gauge,
		},
	]);

	let taskTypeItems = [
		{ value: 'reminder', label: 'Reminder' },
		{ value: 'task', label: 'Task' },
	];
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
			<div class="flex items-center justify-between">
				<h1 class="text-xl font-semibold">{title}</h1>
				{#if view === 'tasks'}
					<SegmentedControl
						items={taskTypeItems}
						defaultValue={type}
						onValueChange={(details) => {
							if (details.value) {
								goto(`/vehicles/${vehicle.id}/add?view=tasks&type=${details.value}`, {
									replaceState: true,
									noScroll: true,
								});
							}
						}}
					/>
				{/if}
			</div>

			{#if view === 'record'}
				<RecordForm
					{vehicle}
					record={{ notes: notesParam } as any}
					action="?/record"
					classifications={data.classifications}
					distanceUnit={vehicle.distanceUnit}
				/>
			{:else if view === 'tasks'}
				{#if type === 'reminder'}
					<p>
						Reminders are mileage-aware, one-off todos for upcoming maintenance, registration
						renewals, inspections, etc
					</p>
					<ReminderForm {vehicle} action="?/reminder" errors={form?.errors} />
				{:else}
					<p>
						Tasks are mileage-aware, recurring reminders that advance automatically when updating
						History. Refer to your owner's manual for your exact maintenance schedule.
					</p>
					<TaskForm {vehicle} errors={form?.errors} />
				{/if}
			{:else if view === 'mileage-adjustment'}
				<p>
					Correct your {mileageLabel(vehicle.distanceUnit)} estimate when you haven't had recent service
					and the estimate is off significantly from actual {mileageLabel(vehicle.distanceUnit)}.
				</p>
				<MileageAdjustmentForm {vehicle} action="?/mileageAdjustment" />
			{/if}
		</Card>
	</div>
</VehiclePageLayout>
