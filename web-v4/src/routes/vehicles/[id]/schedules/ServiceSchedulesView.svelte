<script lang="ts">
	import { Button, Card, SplitButton } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { isScheduleOverdue, sortSchedulesByDue } from '$lib/utils/schedules';
	import { isReminderOverdue, sortRemindersByDue } from '$lib/utils/reminders';
	import { formatMileage } from '$lib/utils/vehicle';
	import { Wrench, Bell, PlusIcon, ChevronRight, RefreshCw, Calendar } from 'lucide-svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Reminder } from '$lib/data/reminders';
	import type { Classification } from '$lib/data/classifications';
	import type { Vehicle } from '$lib/data/vehicles';
	import CompleteScheduleForm from '$lib/components/forms/CompleteScheduleForm.svelte';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import SuggestSchedulesDialog from '$lib/components/dialogs/SuggestSchedulesDialog.svelte';

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

	let completingId = $state<number | null>(null);
	let completingReminderId = $state<number | null>(null);
	let suggestOpen = $state(false);
	let suggestType = $state<string | null>(null);

	const sortedSchedules = $derived(sortSchedulesByDue(schedules, vehicle.estimatedMileage));
	const sortedReminders = $derived(sortRemindersByDue(reminders, vehicle.estimatedMileage));

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
		if (schedule.monthInterval) {
			parts.push(`${schedule.monthInterval} mo`);
		}
		if (schedule.distanceInterval) {
			parts.push(formatMileage(schedule.distanceInterval, vehicle.distanceUnit));
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

	const reminderDueSummary = (reminder: Reminder) => {
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
</script>

<div class="max-w-2xl mx-auto">
	{#if schedules.length || reminders.length}
		{#if reminders.length}
			<div class="mb-3">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold flex items-center gap-2">
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
							New
						</Button>
					{/if}
				</div>
				<p class="text-base text-ink-400 mt-1">One-off notifications for maintenance and deadlines</p>
			</div>
			<ul class="space-y-3 mb-8">
				{#each sortedReminders as reminder (reminder.id)}
					<li>
						<Card variant="outline" size="sm" class="gap-3">
							<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div class="space-y-0">
									<p class="font-medium text-lg flex items-center gap-3">
										{#if isReminderOverdue(reminder, vehicle.estimatedMileage)}
											<span class="w-2 h-2 rounded-full bg-warning shrink-0"></span>
										{/if}
										{reminder.notes}
									</p>
									<p class="text-base text-ink-500">{reminderDueSummary(reminder)}</p>
								</div>
								<div class="flex items-center gap-2">
									<Button
										size="sm"
										variant="ghost"
										href={`/vehicles/${vehicle.id}/reminders/${reminder.id}/edit`}
									>
										Edit
									</Button>
									{#if completingReminderId === reminder.id}
										<Button size="sm" variant="outline" onclick={() => (completingReminderId = null)}
											>Cancel</Button
										>
									{:else}
										<Button
											size="sm"
											variant="outline"
											onclick={() => (completingReminderId = reminder.id)}
											{...umamiEvent('complete_reminder')}
										>
											Complete
											<ChevronRight size={16} />
										</Button>
									{/if}
								</div>
							</div>
							{#if completingReminderId === reminder.id}
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
					</li>
				{/each}
			</ul>
		{/if}

		{#if schedules.length}
			<div class="mb-3">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold flex items-center gap-2">
						<Wrench size={18} />
						Service Tasks
					</h2>
					<div class="flex items-center gap-2">
						{#if !vehicle.retired}
							<SplitButton
								size="sm"
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
									suggestType = e.value;
									suggestOpen = true;
								}}
							>
								<PlusIcon size={14} />
								New
							</SplitButton>
						{/if}
					</div>
				</div>
				<p class="text-base text-ink-400 mt-1">Recurring tasks that auto-advance on completion</p>
			</div>
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
									{#if dueSummary(schedule)}
										<p class="text-base font-medium text-ink-900 flex items-center gap-2">
											<Calendar size={18} class="text-ink-500 shrink-0" />
											{dueSummary(schedule)}
										</p>
									{/if}
									<p class="text-base text-ink-500 flex items-center gap-2">
										<RefreshCw size={18} class="text-ink-500 shrink-0" />
										{intervalSummary(schedule)}
									</p>
								</div>
								<div class="flex items-center gap-2">
									<Button
										size="sm"
										variant="ghost"
										href={`/vehicles/${vehicle.id}/schedules/${schedule.id}/edit`}
									>
										Edit
									</Button>
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
										onComplete={() => (completingId = null)}
									/>
								</div>
							{/if}
						</Card>
					</li>
				{/each}
			</ul>
		{:else if reminders.length}
			<div class="mb-3">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold flex items-center gap-2">
						<Wrench size={18} />
						Service Tasks
					</h2>
					<div class="flex items-center gap-2">
						{#if !vehicle.retired}
							<SplitButton
								size="sm"
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
									suggestType = e.value;
									suggestOpen = true;
								}}
							>
								<Wrench size={14} />
								New
							</SplitButton>
						{/if}
					</div>
				</div>
				<p class="text-base text-ink-400 mt-1">Recurring tasks that auto-advance on completion</p>
			</div>
			<p class="text-ink-400 text-center py-8">No service tasks yet. Add one to track recurring maintenance.</p>
		{/if}
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
						size="sm"
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
							suggestType = e.value;
							suggestOpen = true;
						}}
					>
						<Wrench size={14} />
						New Service Task
					</SplitButton>
				{/if}
			{/snippet}
		</EmptyState>
	{/if}
</div>

<SuggestSchedulesDialog
	open={suggestOpen}
	onOpenChange={(v) => {
		suggestOpen = v;
		if (!v) suggestType = null;
	}}
	initialType={suggestType}
	{existingClassificationNames}
/>
