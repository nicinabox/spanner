<script lang="ts">
	import { Button, Card, Confirm } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { isScheduleOverdue, sortSchedulesByDue } from '$lib/utils/schedules';
	import { formatMileage } from '$lib/utils/vehicle';
	import { Wrench, PlusIcon, ChevronRight, Sparkles } from 'lucide-svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Classification } from '$lib/data/classifications';
	import type { Vehicle } from '$lib/data/vehicles';
	import CompleteScheduleForm from '$lib/components/forms/CompleteScheduleForm.svelte';
	import SuggestSchedulesDialog from '$lib/components/dialogs/SuggestSchedulesDialog.svelte';

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
	let suggestOpen = $state(false);

	const sortedSchedules = $derived(sortSchedulesByDue(schedules, vehicle.estimatedMileage));

	const classificationName = (classificationId: number) => {
		return classifications.find((c) => c.id === classificationId)?.name ?? 'Unknown';
	};

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

	const intervalSummary = (schedule: ServiceSchedule) => {
		const parts: string[] = [];
		if (schedule.distanceInterval) {
			parts.push(`every ${formatMileage(schedule.distanceInterval, vehicle.distanceUnit)}`);
		}
		if (schedule.monthInterval) {
			parts.push(`every ${schedule.monthInterval} mo`);
		}
		return parts.join(' or ');
	};

	const dueSummary = (schedule: ServiceSchedule) => {
		const parts: string[] = [];
		if (schedule.nextDueDate) {
			parts.push(intlFormatDateUTC(schedule.nextDueDate));
		}
		if (schedule.nextDueMileage) {
			if (parts.length) parts.push('or');
			parts.push(formatMileage(schedule.nextDueMileage, vehicle.distanceUnit));
		}
		return parts.length ? `Due ${parts.join(' ')}` : '';
	};
</script>

<div class="max-w-2xl mx-auto">
	{#if schedules.length}
		<header class="flex items-center justify-end gap-2 mb-6">
			{#if !vehicle.retired}
				<Button
					variant="ghost"
					onclick={() => (suggestOpen = true)}
					{...umamiEvent('suggest_schedules')}
				>
					<Sparkles size={16} />
					Presets
				</Button>
				<Button href={`/vehicles/${vehicle.id}/add?view=schedule`} {...umamiEvent('add_schedule')}>
					<PlusIcon size={16} />
					Add Service Task
				</Button>
			{/if}
		</header>

		<ul class="space-y-3">
			{#each sortedSchedules as schedule (schedule.id)}
				<li>
					<Card variant="outline" size="sm" class="gap-3">
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div class="space-y-0">
								<p class="font-medium text-lg flex items-center gap-3">
									{#if isScheduleOverdue(schedule, vehicle.estimatedMileage)}
										<span class="w-2 h-2 rounded-full bg-warning shrink-0"></span>
									{/if}
									{classificationName(schedule.classificationId)}
								</p>
								<p class="text-base text-ink-500">{intervalSummary(schedule)}</p>
								{#if dueSummary(schedule)}
									<p class="text-sm text-ink-400">{dueSummary(schedule)}</p>
								{/if}
							</div>
							<div class="flex items-center gap-2">
								<Confirm title="Delete schedule?">
									{#snippet trigger({ onOpenChange })}
										<Button
											color="danger"
											variant="ghost"
											size="sm"
											onclick={() => onOpenChange(true)}>Delete</Button
										>
									{/snippet}
									{#snippet actions({ onOpenChange })}
										<form method="POST" action="?/delete" class="flex flex-row gap-2">
											<input type="hidden" name="id" value={schedule.id} />
											<Button type="submit" color="danger" variant="outline">Delete</Button>
											<Button variant="solid" onclick={() => onOpenChange(false)}>Cancel</Button>
										</form>
									{/snippet}
									<p>This will permanently delete this schedule.</p>
								</Confirm>
								{#if completingId === schedule.id}
									<Button size="sm" variant="outline" onclick={() => (completingId = null)}
										>Cancel</Button
									>
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
									classificationName={classificationName(schedule.classificationId)}
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
						Add Service Task
					</Button>
				{:else}
					<Button href={`/vehicles/${vehicle.id}/add?view=schedule`}>
						<PlusIcon size={18} />
						Add Service Task
					</Button>
					<Button variant="ghost" onclick={() => (suggestOpen = true)}>
						<Sparkles size={18} />
						Suggest
					</Button>
				{/if}
			{/snippet}
		</EmptyState>
	{/if}
</div>

<SuggestSchedulesDialog
	open={suggestOpen}
	onOpenChange={(v) => (suggestOpen = v)}
	{existingClassificationNames}
/>
