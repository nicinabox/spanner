<script lang="ts">
	import { Button, Card } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import { getIntervalSummary, isScheduleOverdue } from '$lib/utils/tasks';
	import { Calendar, RefreshCw, ChevronRight } from 'lucide-svelte';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import DeferForm from '$lib/components/forms/DeferForm.svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';
	import DueIndicator from './DueIndicator.svelte';

	interface Props {
		schedule: ServiceSchedule;
		vehicle: Vehicle;
		classificationName: string;
		completing: boolean;
		deferring: boolean;
		oncomplete: () => void;
		oncancel: () => void;
		ondefer: () => void;
		oncancelDefer: () => void;
	}

	let { schedule, vehicle, classificationName, completing, deferring, oncomplete, oncancel, ondefer, oncancelDefer }: Props = $props();

	const getDueSummary = (schedule: ServiceSchedule): string => {
		if (schedule.deferred && schedule.nextDueDate) {
			const parts: string[] = [];
			if (schedule.deferDeltaMonths) parts.push(`+${schedule.deferDeltaMonths}mo`);
			if (schedule.deferDeltaMiles) parts.push(`+${formatMileage(schedule.deferDeltaMiles, vehicle.distanceUnit)}`);
			return `Deferred to ${intlFormatDateUTC(schedule.nextDueDate)} (${parts.join(', ')})`;
		}
		if (schedule.nextDueDate) return `Due ${intlFormatDateUTC(schedule.nextDueDate)}`;
		if (schedule.nextDueMileage) return `Due ${formatMileage(schedule.nextDueMileage, vehicle.distanceUnit)}`;
		return '';
	};

	let dueSummary = $derived(getDueSummary(schedule));
	let intervalSummary = $derived(getIntervalSummary(schedule, vehicle.distanceUnit));
</script>

<Card variant="outline" size="sm" class="gap-3">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="space-y-0">
			<div class="flex items-center gap-2">
				{#if isScheduleOverdue(schedule, vehicle.estimatedMileage)}
					<DueIndicator />
				{/if}
				<a
					href={`/vehicles/${vehicle.id}/tasks/${schedule.id}/edit`}
					class="font-medium text-lg text-ink-900 underline"
				>
					{classificationName}
				</a>
			</div>
			{#if dueSummary}
				<p class="text-base text-ink-900 flex items-center gap-2">
					<Calendar size={18} class="text-ink-500 shrink-0" />
					{dueSummary}
				</p>
			{/if}
			<p class="text-base text-ink-500 flex items-center gap-2">
				<RefreshCw size={18} class="text-ink-500 shrink-0" />
				{intervalSummary}
			</p>
		</div>
		<div class="flex items-center gap-2">
			{#if completing}
				<Button size="sm" variant="outline" onclick={oncancel}>Cancel</Button>
			{:else if deferring}
				<Button size="sm" variant="outline" onclick={oncancelDefer}>Cancel</Button>
			{:else}
				<Button
					size="sm"
					variant="ghost"
					onclick={ondefer}
					{...umamiEvent('defer_schedule')}
				>
					Defer
				</Button>
				<Button
					size="sm"
					variant="outline"
					onclick={oncomplete}
					{...umamiEvent('complete_schedule')}
				>
					Complete
					<ChevronRight size={16} />
				</Button>
			{/if}
		</div>
	</div>
	{#if completing}
		<div class="border-t border-ink-200 pt-4">
			<RecordForm
				{vehicle}
				id={schedule.id}
				record={{
					notes: classificationName,
					mileage: vehicle.estimatedMileage,
				} as any}
				action="?/complete"
			/>
		</div>
	{/if}
	{#if deferring}
		<div class="border-t border-ink-200 pt-4">
			<DeferForm {vehicle} {schedule} action="?/defer" />
		</div>
	{/if}
</Card>
