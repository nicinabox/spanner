<script lang="ts">
	import { Button, Card } from '$lib';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { page } from '$app/stores';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';
	import { Bell, ChevronRight, PlusIcon, Trash2 } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let reminders = $derived(data.reminders);

	let activeTab = $derived(
		$page.url.pathname === `/vehicles/${vehicle.id}/reminders` ? 'reminders' : 'history',
	);

	let completingId = $state<number | null>(null);
</script>

<VehiclePageLayout {vehicle} {activeTab}>
	<div class="max-w-2xl mx-auto">
		{#if reminders.length}
			<header class="flex items-center gap-2 mb-6">
				<Button href={`/vehicles/${vehicle.id}/add?view=reminder`} class="ml-auto">
					<PlusIcon size={16} />
					Add Reminder
				</Button>
			</header>
			<ul class="space-y-3">
				{#each reminders as reminder (reminder.id)}
					<li>
						<Card variant="outline" size="sm" class="gap-3">
							<div class="flex items-center justify-between gap-4">
								<div class="space-y-1">
									<p class="font-semibold text-lg">{reminder.notes}</p>
									<p class="text-base text-ink-500">
										Reminder scheduled for
										{#if reminder.reminderDate}
											{intlFormatDateUTC(reminder.reminderDate)}
										{:else if reminder.date}
											{intlFormatDateUTC(reminder.date)}
										{:else}
											an unspecified date
										{/if}
										{#if reminder.mileage}
											at {formatMileage(reminder.mileage, vehicle.distanceUnit)}
										{/if}
									</p>
								</div>
								<div class="flex items-center gap-2">
									{#if completingId === reminder.id}
										<Button variant="ghost" onclick={() => (completingId = null)}>Cancel</Button>
									{:else}
										<Button variant="outline" onclick={() => (completingId = reminder.id)}>
											Complete
											<ChevronRight size={16} />
										</Button>
									{/if}
									<form
										method="POST"
										action={`/vehicles/${vehicle.id}/reminders/${reminder.id}?_method=DELETE`}
									>
										<Button icon variant="ghost" type="submit" danger>
											<Trash2 size={14} />
										</Button>
									</form>
								</div>
							</div>
							{#if completingId === reminder.id}
								<div class="border-t border-ink-200 pt-4">
									<RecordForm
										{vehicle}
										record={{ notes: reminder.notes, mileage: vehicle.estimatedMileage } as any}
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
					<Button size="lg" href={`/vehicles/${vehicle.id}/add?view=reminder`}>Add Reminder</Button>
				{/snippet}
			</EmptyState>
		{/if}
	</div>
</VehiclePageLayout>
