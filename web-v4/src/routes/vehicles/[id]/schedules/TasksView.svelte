<script lang="ts">
	import { Button, SplitButton } from '$lib';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { Bell, Wrench, PlusIcon } from 'lucide-svelte';
	import RemindersSection from '$lib/components/schedules/RemindersSection.svelte';
	import TasksSection from '$lib/components/schedules/TasksSection.svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Reminder } from '$lib/data/reminders';
	import type { Classification } from '$lib/data/classifications';
	import type { Vehicle } from '$lib/data/vehicles';

	let {
		schedules,
		classifications,
		reminders,
		vehicle,
	}: {
		schedules: ServiceSchedule[];
		classifications: Classification[];
		reminders: Reminder[];
		vehicle: Vehicle;
	} = $props();
</script>

<div class="max-w-2xl mx-auto">
	{#if reminders.length}
		<RemindersSection {reminders} {vehicle} />
	{/if}

	{#if schedules.length || reminders.length}
		<TasksSection {schedules} {classifications} {vehicle} />
	{:else}
		<EmptyState
			heading="No reminders yet"
			details="Set reminders for upcoming maintenance, registration renewals, or inspections"
		>
			{#snippet media()}
				<Bell size={48} class="text-ink-300" />
			{/snippet}
			{#snippet action()}
				{#if vehicle.retired}
					<Button disabled>
						<PlusIcon size={18} />
						New Reminder
					</Button>
				{:else}
					<Button href={`/vehicles/${vehicle.id}/add?view=reminder`}>
						<PlusIcon size={18} />
						New Reminder
					</Button>
					<SplitButton
						variant="outline"
						items={[
							{ value: 'car', label: 'Car' },
							{ value: 'motorcycle', label: 'Motorcycle' },
							{ value: 'boat', label: 'Boat' },
							{ value: 'rv', label: 'RV' },
						]}
						onAction={() => {
							window.location.href = `/vehicles/${vehicle.id}/add?view=schedule`;
						}}
						onSelect={(e) => {
							window.location.href = `/vehicles/${vehicle.id}/add?view=schedule&type=${e.value}`;
						}}
					>
						<Wrench size={14} />
						New Task
					</SplitButton>
				{/if}
			{/snippet}
		</EmptyState>
	{/if}
</div>
