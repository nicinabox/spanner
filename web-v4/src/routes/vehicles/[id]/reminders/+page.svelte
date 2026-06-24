<script lang="ts">
	import { Button } from '$lib';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { page } from '$app/stores';
	import { Bell, PlusIcon, Trash2 } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let reminders = $derived(data.reminders);

	let activeTab = $derived(
		$page.url.pathname === `/vehicles/${vehicle.id}/reminders` ? 'reminders' : 'history'
	);
</script>

<VehiclePageLayout {vehicle} {activeTab}>
	<div class="max-w-2xl mx-auto">
		<header class="flex items-center gap-2 mb-6">
			<Button href={`/vehicles/${vehicle.id}/add?view=new-reminder`} class="ml-auto">
				<PlusIcon size={16} />
				Add Reminder
			</Button>
		</header>

		{#if reminders.length}
			<ul class="space-y-3">
				{#each reminders as reminder (reminder.id)}
					<li class="rounded-lg border border-ink-200 bg-surface p-4">
						<div class="flex items-start justify-between gap-4">
							<div class="space-y-1">
								<p class="font-medium">{reminder.notes}</p>
								<div class="flex flex-wrap gap-3 text-sm text-ink-500">
									{#if reminder.date}
										<span>Date: {reminder.date}</span>
									{/if}
									{#if reminder.mileage}
										<span>Mileage: {reminder.mileage}</span>
									{/if}
									{#if reminder.reminderDate}
										<span>Remind: {reminder.reminderDate}</span>
									{/if}
								</div>
							</div>
							<form method="POST" action={`/vehicles/${vehicle.id}/reminders/${reminder.id}?_method=DELETE`}>
								<Button size="sm" variant="tertiary" type="submit">
									<Trash2 size={14} />
								</Button>
							</form>
						</div>
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
					<Button href={`/vehicles/${vehicle.id}/add?view=new-reminder`}>Add Reminder</Button>
				{/snippet}
			</EmptyState>
		{/if}
	</div>
</VehiclePageLayout>
