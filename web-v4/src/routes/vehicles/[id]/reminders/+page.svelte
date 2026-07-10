<script lang="ts">
	import { Button, Card } from '$lib';
	import { umamiEvent } from '$lib/umami';
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
	import ReminderCard from '$lib/components/schedules/ReminderCard.svelte';

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
					<Button
						href={`/vehicles/${vehicle.id}/add?view=tasks&type=reminder`}
						class="ml-auto"
						{...umamiEvent('add_reminder')}
					>
						<PlusIcon size={16} />
						New Reminder
					</Button>
				{/if}
			</header>
			<ul class="space-y-3">
				{#each sortedReminders as reminder (reminder.id)}
					<li>
						<ReminderCard
							{reminder}
							{vehicle}
							completing={completingId === reminder.id}
							oncomplete={() => (completingId = reminder.id)}
							oncancel={() => (completingId = null)}
						/>
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
						<Button href={`/vehicles/${vehicle.id}/add?view=tasks&type=reminder`}>
							<PlusIcon size={18} />
							New Reminder
						</Button>
					{/if}
				{/snippet}
			</EmptyState>
		{/if}
	</div>
</VehiclePageLayout>
