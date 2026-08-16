<script lang="ts">
	import { Button } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import Stat from '$lib/components/common/Stat.svelte';
	import HistoryTable from '$lib/components/HistoryTable.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { page } from '$app/state';
	import { BookOpenText, PlusIcon, Search, X } from 'lucide-svelte';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import NextOverdueTask from '$lib/components/vehicles/NextOverdueTask.svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';
	import { createHistorySearch } from '$lib/utils/historySearch.svelte';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let history = $derived(data.history);

	const historySearch = createHistorySearch(() => history);

	let searchInputEl: HTMLInputElement | undefined = $state();

	function applyClassificationFilter(name: string) {
		historySearch.query = name;
		searchInputEl?.focus();
		searchInputEl?.scrollIntoView({ block: 'center' });
	}

	let activeTab = $derived(
		page.url.pathname === `/vehicles/${vehicle.id}` ? 'history' : 'history',
	);
</script>

<svelte:head>
	<title>{pageTitle(data.vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout {vehicle} {activeTab}>
	<div class="max-w-6xl mx-auto">
		{#if history.length}
			<div class="mb-6 flex gap-12 md:gap-16 overflow-auto pointer-coarse:no-scrollbar">
				<NextOverdueTask
					{vehicle}
					reminders={data.reminders}
					schedules={vehicle.serviceSchedules}
				/>
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
			<EmptyState heading="No history yet" details="Start with your purchase as the first record.">
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
						<Button
							href="/vehicles/{vehicle.id}/add?view=record&notes=Purchase"
							{...umamiEvent('add_record')}
						>
							<PlusIcon size={18} />
							Add Purchase
						</Button>
					{/if}
				{/snippet}
			</EmptyState>
		{:else}
			<div class="flex justify-between gap-10 mb-4">
				<InputGroup variant="filled" class="w-full sm:w-1/2 lg:w-1/3">
					<span class="p-3 text-sm text-ink-500">
						<Search size={16} />
					</span>
					<Input
						bind:value={historySearch.query}
						bind:ref={searchInputEl}
						type="search"
						name="search"
						placeholder="Search history"
					/>
					{#if historySearch.query}
						<button
							type="button"
							onclick={() => (historySearch.query = '')}
							class="flex rounded-xs items-center text-ink-500 hover:text-ink-800 p-3"
						>
							<X size={16} />
						</button>
					{/if}
				</InputGroup>
				{#if !vehicle.retired}
					<Button href="/vehicles/{vehicle.id}/add" {...umamiEvent('add_record')}>
						<PlusIcon size={16} />
						New...
					</Button>
				{/if}
			</div>

			{#if !historySearch.filtered.length && historySearch.query.length >= historySearch.minQueryLength}
				<p class="text-center text-ink-400 py-12">No results for "{historySearch.query}"</p>
			{:else}
				<HistoryTable
					history={historySearch.filtered}
					{vehicle}
					editable={!vehicle.retired}
					onClassificationClick={applyClassificationFilter}
				/>
			{/if}
		{/if}
	</div>
</VehiclePageLayout>
