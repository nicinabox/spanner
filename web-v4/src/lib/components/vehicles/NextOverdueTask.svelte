<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import { ChevronRight } from 'lucide-svelte';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';
	import { isReminderOverdue } from '$lib/utils/reminders';
	import { sortUnifiedByDue, isScheduleOverdue } from '$lib/utils/tasks';
	import type { Reminder } from '$lib/data/reminders';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';
	import DueIndicator from '../schedules/DueIndicator.svelte';

	interface Props {
		vehicle: Vehicle;
		reminders: Reminder[];
		schedules: ServiceSchedule[];
	}

	let { vehicle, reminders, schedules }: Props = $props();

	let item = $derived.by(() => {
		const sorted = sortUnifiedByDue(reminders, schedules, vehicle.estimatedMileage);
		return sorted.find((entry) => {
			if (entry.kind === 'reminder') return isReminderOverdue(entry.data, vehicle.estimatedMileage);
			return isScheduleOverdue(entry.data, vehicle.estimatedMileage);
		});
	});

	let title = $derived(
		item?.kind === 'reminder' ? item.data.notes : (item?.data.classificationName ?? 'Unknown'),
	);

	let dueLine = $derived.by(() => {
		if (!item) return '';
		const datePart =
			item.kind === 'reminder' ? (item.data.reminderDate ?? item.data.date) : item.data.nextDueDate;
		const mileagePart = item.kind === 'reminder' ? item.data.mileage : item.data.nextDueMileage;
		if (!datePart && !mileagePart) return '';
		const parts: string[] = [];
		if (datePart) parts.push(intlFormatDateUTC(datePart));
		if (mileagePart) {
			if (datePart) parts.push('or');
			parts.push(formatMileage(mileagePart, vehicle.distanceUnit));
		}
		return `Due ${parts.join(' ')}`;
	});
</script>

{#if item}
	<a href={`/vehicles/${vehicle.id}/tasks`} class="no-underline text-inherit min-w-fit">
		<Card variant="outline" size="sm" class="py-2 px-4 gap-0 min-w-60 hover:bg-surface-raised">
			<p class="text-lg font-medium flex items-center gap-2">
				<DueIndicator />
				<span class="truncate max-w-xs flex-1">{title}</span>
				<ChevronRight size={16} class="text-ink-400 shrink-0" />
			</p>
			{#if dueLine}
				<p class="text-sm text-ink-500 truncate">{dueLine}</p>
			{/if}
		</Card>
	</a>
{/if}
