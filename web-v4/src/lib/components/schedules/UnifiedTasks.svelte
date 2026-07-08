<script lang="ts">
	import { Button, SplitButton } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import { sortUnifiedByDue } from '$lib/utils/tasks';
	import { Bell, Wrench, PlusIcon } from 'lucide-svelte';
	import ReminderCard from './ReminderCard.svelte';
	import TaskCard from './TaskCard.svelte';
	import SuggestTasksDialog from '$lib/components/dialogs/SuggestTasksDialog.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import type { Reminder } from '$lib/data/reminders';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Classification } from '$lib/data/classifications';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { PresetGroup } from '$lib/data/serviceSchedules.remote';

	interface Props {
		reminders: Reminder[];
		schedules: ServiceSchedule[];
		classifications: Classification[];
		vehicle: Vehicle;
		presetGroups: Record<string, PresetGroup>;
	}

	let { reminders, schedules, classifications, vehicle, presetGroups }: Props = $props();

	let completingId = $state<string | null>(null);
	let suggestOpen = $state(false);
	let suggestType = $state<string | null>(null);

	let splitItems = $derived(
		Object.entries(presetGroups).map(([key, group]) => ({
			value: key,
			label: group.name,
		})),
	);

	const existingClassificationNames = $derived(
		new Set(
			schedules
				.map((s) => {
					const c = classifications.find((cl) => cl.id === s.classificationId);
					return c?.name.toLowerCase();
				})
				.filter(Boolean) as string[],
		),
	);

	const sorted = $derived(sortUnifiedByDue(reminders, schedules, vehicle.estimatedMileage));

	const classificationName = (classificationId: number): string => {
		return classifications.find((c) => c.id === classificationId)?.name ?? 'Unknown';
	};

	const hasItems = $derived(reminders.length > 0 || schedules.length > 0);
</script>

{#if hasItems}
	<div class="mb-3">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
			<h2 class="text-xl font-semibold flex items-center gap-2">Tasks &amp; Reminders</h2>
			<div class="flex flex-row items-center gap-2 max-sm:*:flex-1">
				{#if !vehicle.retired}
					<Button
						variant="outline"
						size="sm"
						href={`/vehicles/${vehicle.id}/add?view=tasks&type=reminder`}
						{...umamiEvent('add_reminder')}
					>
						<Bell size={14} />
						New Reminder
					</Button>
					<SplitButton
						size="sm"
						items={splitItems}
						onAction={() => {
							window.location.href = `/vehicles/${vehicle.id}/add?view=tasks&type=task`;
						}}
						onSelect={(e) => {
							suggestType = e.value;
							suggestOpen = true;
						}}
					class="w-full sm:w-auto [&>*:first-child]:flex-1"
					>
						<PlusIcon size={14} />
						New Task
					</SplitButton>
				{/if}
			</div>
		</div>
	</div>
	<ul class="space-y-3">
		{#each sorted as item (item.kind === 'reminder' ? `reminder-${item.data.id}` : `schedule-${item.data.id}`)}
			<li>
				{#if item.kind === 'reminder'}
					<ReminderCard
						reminder={item.data}
						{vehicle}
						completing={completingId === `reminder-${item.data.id}`}
						oncomplete={() => (completingId = `reminder-${item.data.id}`)}
						oncancel={() => (completingId = null)}
					/>
				{:else}
					<TaskCard
						schedule={item.data}
						{vehicle}
						classificationName={classificationName(item.data.classificationId)}
						completing={completingId === `schedule-${item.data.id}`}
						oncomplete={() => (completingId = `schedule-${item.data.id}`)}
						oncancel={() => (completingId = null)}
					/>
				{/if}
			</li>
		{/each}
	</ul>
{:else}
	<EmptyState
		heading="No tasks or reminders yet"
		details="Track one-off reminders and recurring maintenance tasks for this vehicle"
	>
		{#snippet media()}
			<Wrench size={48} class="text-ink-300" />
		{/snippet}
		{#snippet action()}
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					href={`/vehicles/${vehicle.id}/add?view=tasks&type=reminder`}
					{...umamiEvent('add_reminder_empty')}
				>
					<Bell size={14} />
					New Reminder
				</Button>
				<SplitButton
					items={splitItems}
					onAction={() => {
						window.location.href = `/vehicles/${vehicle.id}/add?view=tasks&type=task`;
					}}
					onSelect={(e) => {
						suggestType = e.value;
						suggestOpen = true;
					}}
					{...umamiEvent('add_task_empty')}
				>
					<PlusIcon size={14} />
					New Task
				</SplitButton>
			</div>
		{/snippet}
	</EmptyState>
{/if}

<SuggestTasksDialog
	open={suggestOpen}
	onOpenChange={(v) => {
		suggestOpen = v;
		if (!v) suggestType = null;
	}}
	initialType={suggestType}
	{existingClassificationNames}
	distanceUnit={vehicle.distanceUnit}
/>
