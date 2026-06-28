<script lang="ts">
	import { Button, Card } from '$lib';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { page } from '$app/stores';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';
	import { Bell, ChevronRight, PlusIcon } from 'lucide-svelte';
	import { isReminderOverdue, sortRemindersByDue } from '$lib/utils/reminders';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let reminders = $derived(data.reminders);

	let activeTab = $derived(
		$page.url.pathname === `/vehicles/${vehicle.id}/reminders` ? 'reminders' : 'history',
	);

	let completingId = $state<number | null>(null);

	let sortedReminders = $derived(sortRemindersByDue(reminders, vehicle.estimatedMileage));
</script>

<svelte:head>
	<title>{pageTitle('Reminders', data.vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout {vehicle} {activeTab}>
	<div class="max-w-2xl mx-auto">
		{#if reminders.length}
			<header class="flex items-center gap-2 mb-6">
				{#if !vehicle.retired}
					<Button href={`/vehicles/${vehicle.id}/add?view=reminder`} class="ml-auto">
						<PlusIcon size={16} />
						New Reminder
					</Button>
				{/if}
			</header>
			<ul class="space-y-3">
				{#each sortedReminders as reminder (reminder.id)}
					<li>
						<Card variant="outline" size="sm" class="gap-3">
							<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div class="space-y-1">
									<p class="font-semibold text-lg flex items-center gap-3">
										{#if isReminderOverdue(reminder, vehicle.estimatedMileage)}
											<span class="w-2 h-2 rounded-full bg-warning shrink-0"></span>
										{/if}
										{reminder.notes}
									</p>
									<p class="text-base text-ink-500">
										{#if !reminder.reminderType}
											No reminder set
										{:else}
											Due
											{#if reminder.reminderDate || reminder.date}
												<span class="font-semibold"
													>{intlFormatDateUTC(reminder.reminderDate ?? reminder.date!)}</span
												>
												{#if reminder.mileage}
													or
												{/if}
											{/if}
											{#if reminder.mileage}
												<span class="font-semibold"
													>{formatMileage(reminder.mileage, vehicle.distanceUnit)}</span
												>
											{/if}
										{/if}
									</p>
								</div>
								<div class="flex items-center gap-2">
									<Button
										size="sm"
										href={`/vehicles/${vehicle.id}/reminders/${reminder.id}/edit`}
										variant="ghost"
									>
										Edit
									</Button>
									{#if completingId === reminder.id}
										<Button size="sm" variant="outline" onclick={() => (completingId = null)}
											>Cancel</Button
										>
									{:else}
										<Button
											size="sm"
											variant="outline"
											onclick={() => (completingId = reminder.id)}
										>
											Complete
											<ChevronRight size={16} />
										</Button>
									{/if}
								</div>
							</div>
							{#if completingId === reminder.id}
								<div class="border-t border-ink-200 pt-4">
									<RecordForm
										{vehicle}
										record={{ notes: reminder.notes, mileage: vehicle.estimatedMileage } as any}
										action={`/vehicles/${vehicle.id}/add?/record&reminder_id=${reminder.id}`}
									/>
								</div>
							{/if}
						</Card>
					</li>
				{/each}
			</ul>
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
					{/if}
				{/snippet}
			</EmptyState>
		{/if}
	</div>
</VehiclePageLayout>
