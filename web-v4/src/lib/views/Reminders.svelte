<script lang="ts">
	import { page } from '$app/state';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { isReminderOverdue } from '$lib/utils/reminders';
	import { formatMileage } from '$lib/utils/vehicle';
	import { PlusIcon, WrenchIcon, ChevronRight } from 'lucide-svelte';

	interface Props {
		vehicle: Vehicle;
	}

	const { vehicle }: Props = $props();

	let showAddToHistoryIndex = $state(-1);
	const toggleAddToHistory = (index: number) => {
		showAddToHistoryIndex = index === showAddToHistoryIndex ? -1 : index;
	};
</script>

{#if vehicle.reminders.length}
	<header class="my-8 flex">
		<Button class="ml-auto" href={`/vehicles/${page.params.id}/add?view=new-reminder`}>
			<PlusIcon size={16} />
			New Reminder
		</Button>
	</header>
	<ul>
		{#each vehicle.reminders as reminder, index (reminder.id)}
			<li class="mb-4 rounded-lg border bg-muted/50 px-6 py-4 shadow-sm">
				<div class="flex items-center justify-between gap-4">
					<div>
						<h3 class="text-lg font-semibold">
							{#if isReminderOverdue(reminder)}
								<span class="badge mr-2 bg-amber-500 text-amber-950">
									<WrenchIcon size={14} />
									Overdue
								</span>
							{/if}
							{reminder.notes}
						</h3>

						<span class="text-secondary-foreground">
							{#if reminder.reminderDate || reminder.mileage}
								Scheduled for
								{#if reminder.reminderDate}
									<strong>{intlFormatDateUTC(reminder.reminderDate)}</strong>
								{/if}
								{#if reminder.reminderType === 'date_or_mileage' && reminder.reminderDate}
									or
								{/if}
								{#if reminder.reminderType === 'mileage'}
									at
								{/if}
								{#if reminder.mileage}
									<strong>{formatMileage(reminder.mileage, vehicle.distanceUnit)}</strong>
								{/if}
							{:else}
								<span class="text-muted-foreground">No reminder set</span>
							{/if}
						</span>
					</div>

					<aside class="flex gap-2">
						<Button variant="secondary">Edit</Button>
						<Button
							class="group"
							onclick={() => {
								toggleAddToHistory(index);
							}}
							aria-expanded={showAddToHistoryIndex === index}
							aria-controls={`add-to-history-form-${index}`}
							variant="outline"
						>
							Make History <ChevronRight class="group-aria-expanded:rotate-90" />
						</Button>
					</aside>
				</div>
				<section
					id={`add-to-history-form-${index}`}
					hidden={showAddToHistoryIndex !== index}
					class="my-3 rounded-md bg-secondary p-4"
				>
					<RecordForm {vehicle} />
				</section>
			</li>
		{/each}
	</ul>
{:else}
	<EmptyState
		heading="Get reminders in your inbox"
		details="Use reminders to get notified on a date or mileage."
	/>
{/if}
