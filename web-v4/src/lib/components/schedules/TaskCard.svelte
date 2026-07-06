<script lang="ts">
	import { Button, Card } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import { isScheduleOverdue } from '$lib/utils/schedules';
	import { Calendar, RefreshCw, ChevronRight } from 'lucide-svelte';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';

	interface Props {
		schedule: ServiceSchedule;
		vehicle: Vehicle;
		classificationName: string;
		dueSummary: string;
		intervalSummary: string;
		completing: boolean;
		oncomplete: () => void;
		oncancel: () => void;
	}

	let {
		schedule,
		vehicle,
		classificationName,
		dueSummary,
		intervalSummary,
		completing,
		oncomplete,
		oncancel,
	}: Props = $props();
</script>

<li>
	<Card variant="outline" size="sm" class="gap-3">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div class="space-y-0">
				<a
					href={`/vehicles/${vehicle.id}/schedules/${schedule.id}/edit`}
					class="font-medium text-lg flex items-center gap-3 text-ink-900 underline"
				>
					{#if isScheduleOverdue(schedule, vehicle.estimatedMileage)}
						<span class="w-2 h-2 rounded-full bg-warning shrink-0"></span>
					{/if}
					{classificationName}
				</a>
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
				{:else}
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
	</Card>
</li>
