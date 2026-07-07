<script lang="ts">
	import { Button } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import { sortRemindersByDue } from '$lib/utils/reminders';
	import { Bell } from 'lucide-svelte';
	import ReminderCard from './ReminderCard.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import type { Reminder } from '$lib/data/reminders';
	import type { Vehicle } from '$lib/data/vehicles';

	interface Props {
		reminders: Reminder[];
		vehicle: Vehicle;
	}

	let { reminders, vehicle }: Props = $props();

	let completingId = $state<number | null>(null);
	const sorted = $derived(sortRemindersByDue(reminders, vehicle.estimatedMileage));
</script>

<div class="mb-3">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold flex items-center gap-2">
			<Bell size={18} />
			Reminders
		</h2>
		{#if !vehicle.retired}
			<Button
				size="sm"
				href={`/vehicles/${vehicle.id}/add?view=reminder`}
				{...umamiEvent('add_reminder')}
			>
				<Bell size={14} />
				New Reminder
			</Button>
		{/if}
	</div>
	<p class="text-base text-ink-400 mt-1">One-off todos for maintenance and deadlines</p>
</div>

{#if reminders.length}
	<ul class="space-y-3">
		{#each sorted as reminder (reminder.id)}
			<li>
				<ReminderCard
					{reminder}
					{vehicle}
					completing={completingId === reminder.id}
					oncomplete={() => (completingId = reminder.id)}
					oncancel={() => (completingId = null)}
				/>
			</li>
		{/each}
	</ul>
{:else}
	<EmptyState
		size="md"
		heading="No reminders yet"
		details="Set reminders for upcoming maintenance, registration renewals, or inspections"
		variant="filled"
		class="max-w-none bg-ink-50 text-ink-700"
	/>
{/if}
