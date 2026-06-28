<script lang="ts">
	import { Button } from '$lib';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import Stat from '$lib/components/common/Stat.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import HistoryTable from '$lib/components/HistoryTable.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { page } from '$app/stores';
	import { BookOpenText, ChevronRight, PlusIcon, Search } from 'lucide-svelte';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';
	import { isReminderOverdue, sortRemindersByDue } from '$lib/utils/reminders';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let history = $derived(data.history);
	let nextReminder = $derived(
		sortRemindersByDue(data.reminders, vehicle.estimatedMileage)[0],
	);
	let reminderOverdue = $derived(
		nextReminder ? isReminderOverdue(nextReminder, vehicle.estimatedMileage) : false,
	);
	let reminderDueLine = $derived.by(() => {
		if (!nextReminder) return '';
		const datePart = nextReminder.reminderDate ?? nextReminder.date;
		if (!datePart && !nextReminder.mileage) return '';
		const parts: string[] = [];
		if (datePart) parts.push(intlFormatDateUTC(datePart));
		if (nextReminder.mileage) {
			if (datePart) parts.push('or');
			parts.push(formatMileage(nextReminder.mileage, vehicle.distanceUnit));
		}
		return `Due ${parts.join(' ')}`;
	});

	let searchQuery = $state('');

	let activeTab = $derived(
		$page.url.pathname === `/vehicles/${vehicle.id}` ? 'history' : 'history',
	);

	let filteredHistory = $derived(
		searchQuery
			? history.filter((item) =>
					JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase()),
				)
			: history,
	);
</script>

<svelte:head>
	<title>{pageTitle(data.vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout {vehicle} {activeTab}>
	<div class="max-w-6xl mx-auto">
		{#if history.length}
			<div
				class="mb-6 flex gap-12 md:gap-16 overflow-auto pointer-coarse:no-scrollbar"
			>
				{#if nextReminder}
					<a
						href={`/vehicles/${vehicle.id}/reminders`}
						class="no-underline text-inherit min-w-fit"
					>
						<Card variant="outline" size="sm" class="py-2 px-4 gap-0 min-w-60 hover:bg-surface-raised">
							<p class="text-lg font-semibold flex items-center gap-2">
								{#if reminderOverdue}
									<span class="w-1.5 h-1.5 rounded-full bg-warning shrink-0"></span>
								{/if}
								<span class="truncate max-w-xs flex-1">{nextReminder.notes}</span>
								<ChevronRight size={16} class="text-ink-400 shrink-0" />
							</p>
							{#if reminderDueLine}
								<p class="text-sm text-ink-500 truncate">{reminderDueLine}</p>
							{/if}
						</Card>
					</a>
				{/if}
				<Stat
					title="Estimated mileage"
					value={vehicle.estimatedMileage
						? `${vehicle.estimatedMileage.toLocaleString()} ${vehicle.distanceUnit}`
						: null}
				/>
				<Stat
					title="Mileage rate"
					value={vehicle.milesPerYear
						? `${vehicle.milesPerYear.toLocaleString()} ${vehicle.distanceUnit}/yr`
						: null}
				/>
				<Stat title="Since" value={history[0] ? intlFormatDateUTC(history[0].date) : null} />
				<Stat title="VIN" value={vehicle.vin} />
			</div>
		{/if}

		{#if !history.length}
			<EmptyState
				heading="No history yet"
				details="Start with your purchase as the first record."
			>
				{#snippet media()}
					<BookOpenText size={48} class="text-ink-300" />
				{/snippet}
				{#snippet action()}
					{#if vehicle.retired}
						<Button disabled>
							<PlusIcon size={18} />
							Add Purchase
						</Button>
					{:else}
						<Button href="/vehicles/{vehicle.id}/add?view=record&notes=Purchase">
							<PlusIcon size={18} />
							Add Purchase
						</Button>
					{/if}
				{/snippet}
			</EmptyState>
		{:else}
			<div class="flex justify-between gap-10 mb-4">
				<InputGroup
					type="search"
					name="search"
					placeholder="Search history"
					variant="filled"
					class="w-full sm:w-1/2 lg:w-1/3"
					bind:value={searchQuery}
				>
					{#snippet start()}<Search size={16} />{/snippet}
				</InputGroup>
				{#if !vehicle.retired}
					<Button href="/vehicles/{vehicle.id}/add">
						<PlusIcon size={16} />
						New...
					</Button>
				{/if}
			</div>

			{#if !filteredHistory.length}
				<p class="text-center text-ink-400 py-12">No results for "{searchQuery}"</p>
			{:else}
				<HistoryTable history={filteredHistory} {vehicle} editable={!vehicle.retired} />
			{/if}
		{/if}
	</div>
</VehiclePageLayout>
