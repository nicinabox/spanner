<script lang="ts">
	import { Button, Card } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import { isReminderOverdue } from '$lib/utils/reminders';
	import { ChevronRight } from 'lucide-svelte';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import type { Reminder } from '$lib/data/reminders';
	import type { Vehicle } from '$lib/data/vehicles';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';

	interface Props {
		reminder: Reminder;
		vehicle: Vehicle;
		completing: boolean;
		oncomplete: () => void;
		oncancel: () => void;
	}

	let { reminder, vehicle, completing, oncomplete, oncancel }: Props = $props();

	export const getDueSummary = (reminder: Reminder): string => {
		if (!reminder.reminderType) return '';
		const parts: string[] = [];

		if (reminder.reminderDate || reminder.date) {
			parts.push(intlFormatDateUTC(reminder.reminderDate ?? reminder.date!));
		}

		if (reminder.mileage) {
			if (parts.length) parts.push('or');
			parts.push(formatMileage(reminder.mileage, vehicle.distanceUnit));
		}

		return `Due ${parts.join(' ')}`;
	};

	let dueSummary = $derived(getDueSummary(reminder));
</script>

<Card variant="outline" size="sm" class="gap-3">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="space-y-0">
			<a
				href={`/vehicles/${vehicle.id}/reminders/${reminder.id}/edit`}
				class="font-medium text-lg flex items-center gap-3 text-ink-900 underline"
			>
				{#if isReminderOverdue(reminder, vehicle.estimatedMileage)}
					<span class="w-2 h-2 rounded-full bg-warning shrink-0"></span>
				{/if}
				{reminder.notes}
			</a>
			{#if dueSummary}
				<p class="text-base text-ink-500">{dueSummary}</p>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			{#if completing}
				<Button size="sm" variant="outline" onclick={oncancel}>Cancel</Button>
			{:else}
				<Button
					size="sm"
					variant="outline"
					onclick={oncomplete}
					{...umamiEvent('complete_reminder')}
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
				record={{
					notes: reminder.notes,
					mileage: vehicle.estimatedMileage,
				} as any}
				action={`/vehicles/${vehicle.id}/add?/record&reminder_id=${reminder.id}`}
			/>
		</div>
	{/if}
</Card>
