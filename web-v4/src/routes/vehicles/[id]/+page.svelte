<script lang="ts">
	import { Button } from '$lib';
	import Input from '$lib/components/common/Input.svelte';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import Stat from '$lib/components/common/Stat.svelte';
	import HistoryTable from '$lib/components/HistoryTable.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { page } from '$app/stores';
	import { BookOpenText, PlusIcon } from 'lucide-svelte';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let history = $derived(data.history);

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

<VehiclePageLayout {vehicle} {activeTab}>
	<div class="max-w-6xl mx-auto">
		{#if history.length}
			<div
				class="mb-6 flex justify-between gap-12 md:gap-16 overflow-auto pointer-coarse:no-scrollbar"
			>
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
				heading="Add your vehicle's history"
				details="Try adding your purchase as the first record"
			>
				{#snippet media()}
					<BookOpenText size={48} class="text-ink-300" />
				{/snippet}
				{#snippet action()}
					<Button size="lg" href="/vehicles/{vehicle.id}/add?notes=Purchase">Add Purchase</Button>
				{/snippet}
			</EmptyState>
		{:else if !filteredHistory.length}
			<div class="flex justify-between gap-10 mb-4">
				<Input
					type="search"
					name="search"
					placeholder="Search history"
					size="lg"
					class="w-full sm:w-1/2 lg:w-1/3 bg-ink-200/50 focus:bg-ink-50"
					bind:value={searchQuery}
				/>
			</div>
			<p class="text-center text-ink-400 py-12">No results for "{searchQuery}"</p>
		{:else}
			<div class="flex justify-between gap-10 mb-4">
				<Input
					type="search"
					name="search"
					placeholder="Search history"
					size="lg"
					class="w-full sm:w-1/2 lg:w-1/3 bg-ink-200/50 focus:bg-ink-50"
					bind:value={searchQuery}
				/>
				<Button href="/vehicles/{vehicle.id}/add" size="lg">
					<PlusIcon size={16} />
					New...
				</Button>
			</div>
			<HistoryTable history={filteredHistory} {vehicle} />
		{/if}
	</div>
</VehiclePageLayout>
