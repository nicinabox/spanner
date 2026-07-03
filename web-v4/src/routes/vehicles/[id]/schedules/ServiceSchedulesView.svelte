<script lang="ts">
	import { Button, Card } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';
	import { Wrench, PlusIcon, ChevronRight, X } from 'lucide-svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Classification } from '$lib/data/classifications';
	import type { Vehicle } from '$lib/data/vehicles';
	import CompleteScheduleForm from '$lib/components/forms/CompleteScheduleForm.svelte';
	import ServiceScheduleForm from '$lib/components/forms/ServiceScheduleForm.svelte';

	let {
		schedules,
		classifications,
		vehicle,
	}: {
		schedules: ServiceSchedule[];
		classifications: Classification[];
		vehicle: Vehicle;
	} = $props();

	let completingId = $state<number | null>(null);
	let creating = $state(false);

	const classificationName = (classificationId: number) => {
		return classifications.find((c) => c.id === classificationId)?.name ?? 'Unknown';
	};

	const intervalSummary = (schedule: ServiceSchedule) => {
		const parts: string[] = [];
		if (schedule.distance_interval) {
			parts.push(`every ${formatMileage(schedule.distance_interval, vehicle.distanceUnit)}`);
		}
		if (schedule.month_interval) {
			parts.push(`every ${schedule.month_interval} mo`);
		}
		return parts.join(' or ');
	};

	const dueSummary = (schedule: ServiceSchedule) => {
		const parts: string[] = [];
		if (schedule.next_due_date) {
			parts.push(intlFormatDateUTC(schedule.next_due_date));
		}
		if (schedule.next_due_mileage) {
			if (parts.length) parts.push('or');
			parts.push(formatMileage(schedule.next_due_mileage, vehicle.distanceUnit));
		}
		return parts.length ? `Due ${parts.join(' ')}` : '';
	};
</script>

<div class="max-w-2xl mx-auto">
	{#if schedules.length || creating}
		<header class="flex items-center gap-2 mb-6">
			{#if !vehicle.retired && !creating}
				<Button class="ml-auto" onclick={() => (creating = true)} {...umamiEvent('add_schedule')}>
					<PlusIcon size={16} />
					Add Schedule
				</Button>
			{/if}
		</header>

		{#if creating}
			<Card variant="outline" size="sm" class="mb-6">
				<div class="flex items-center justify-between mb-3">
					<p class="font-medium">New Schedule</p>
					<button onclick={() => (creating = false)} class="text-ink-400 hover:text-ink-700">
						<X size={18} />
					</button>
				</div>
				<ServiceScheduleForm {vehicle} {classifications} />
			</Card>
		{/if}

		<ul class="space-y-3">
			{#each schedules as schedule (schedule.id)}
				<li>
					<Card variant="outline" size="sm" class="gap-3">
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div class="space-y-0">
								<p class="font-medium text-lg">{classificationName(schedule.classification_id)}</p>
								<p class="text-base text-ink-500">{intervalSummary(schedule)}</p>
								{#if dueSummary(schedule)}
									<p class="text-sm text-ink-400">{dueSummary(schedule)}</p>
								{/if}
							</div>
							<div class="flex items-center gap-2">
								<form method="POST" action="?/delete">
									<input type="hidden" name="id" value={schedule.id} />
									<Button size="sm" variant="ghost" type="submit">Delete</Button>
								</form>
								{#if completingId === schedule.id}
									<Button size="sm" variant="outline" onclick={() => (completingId = null)}>Cancel</Button>
								{:else}
									<Button
										size="sm"
										variant="outline"
										onclick={() => (completingId = schedule.id)}
										{...umamiEvent('complete_schedule')}
									>
										Complete
										<ChevronRight size={16} />
									</Button>
								{/if}
							</div>
						</div>
						{#if completingId === schedule.id}
							<div class="border-t border-ink-200 pt-4">
								<CompleteScheduleForm
									{vehicle}
									scheduleId={schedule.id}
									classificationName={classificationName(schedule.classification_id)}
								/>
							</div>
						{/if}
					</Card>
				</li>
			{/each}
		</ul>
	{:else}
		<EmptyState
			heading="No schedules yet"
			details="Set up recurring maintenance schedules for your vehicle"
		>
			{#snippet media()}
				<Wrench size={48} class="text-ink-300" />
			{/snippet}
			{#snippet action()}
				{#if vehicle.retired}
					<Button disabled>
						<PlusIcon size={18} />
						Add Schedule
					</Button>
				{:else}
					<Button onclick={() => (creating = true)}>
						<PlusIcon size={18} />
						Add Schedule
					</Button>
				{/if}
			{/snippet}
		</EmptyState>
	{/if}
</div>
