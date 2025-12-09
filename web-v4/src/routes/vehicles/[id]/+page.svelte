<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import Stat from '$lib/components/Stat.svelte';
	import { formatEstimatedMileage, formatMilesPerYear } from '$lib/utils/vehicle';
	import HistoryTable from '$lib/components/HistoryTable.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { resolve } from '$app/paths';
	import Markdown from '$lib/components/Markdown.svelte';
	import { parseDateUTC } from '$lib/utils/date';
	import { intlFormat } from 'date-fns';
	import Button from '$lib/components/ui/Button.svelte';
	import { PlusIcon } from 'lucide-svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let { data }: PageProps = $props();

	const view = $derived(page.url.searchParams.get('view') ?? 'history');

	let searchQuery = $state('');
	let history = $derived.by(() => {
		if (!searchQuery) return data.history;
		return data.history.filter((item) =>
			JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
		);
	});
</script>

<div>
	{#if view === 'history'}
		<section class="my-8" id="history">
			{#if data.history.length}
				<header class="my-8">
					<div class="flex justify-between gap-16 overflow-auto pointer-coarse:no-scrollbar">
						<Stat title="Estimated Mileage" value={formatEstimatedMileage(data.vehicle)} />
						<Stat title="Mileage Rate" value={formatMilesPerYear(data.vehicle)} />
						<Stat
							title="Since"
							value={intlFormat(parseDateUTC(data.history[0]?.date), {
								month: 'short',
								year: 'numeric',
								day: 'numeric'
							})}
						/>
						<Stat title="VIN" value={data.vehicle.vin} />
					</div>
				</header>

				<div class="flex justify-between gap-10">
					<Input
						type="search"
						name="search"
						placeholder="Search history"
						class="mb-4 w-full sm:w-1/2 lg:w-1/3"
						bind:value={searchQuery}
						onfocus={(e) => e.target?.select()}
					/>

					<Button class="ml-auto" href={`/vehicles/${page.params.id}/add`}>
						<PlusIcon size={16} />
						New...
					</Button>
				</div>

				<HistoryTable vehicle={data.vehicle} {history} />
			{:else}
				<EmptyState
					heading="Add your vehicle's history"
					details="Try adding your purchase as the first record."
				>
					{#snippet action()}
						<Button href={resolve(`/vehicles/${data.vehicle.id}/add?notes=Purchase`)}>
							Add Purchase
						</Button>
					{/snippet}
				</EmptyState>
			{/if}
		</section>
	{/if}

	{#if view === 'reminders'}
		<section class="my-8" id="reminders">
			{#if data.vehicle.reminders.length}
				<h2 class="h2">Reminders</h2>
				<ul>
					{#each data.vehicle.reminders as reminder (reminder.id)}
						<li>{reminder.notes}</li>
					{/each}
				</ul>
			{:else}
				<EmptyState
					heading="Get reminders in your inbox"
					details="Use reminders to get notified on a date or mileage."
				/>
			{/if}
		</section>
	{/if}

	{#if view === 'notes'}
		<section class="my-8" id="notes">
			{#if data.vehicle.notes}
				<h2 class="h2">Notes</h2>
				<div class="rounded-md border bg-card p-4">
					<Markdown src={data.vehicle.notes} />
				</div>
			{:else}
				<EmptyState
					heading="Notes are for hard-to-remember things"
					details="Add tire pressures, oil capacity, or how to reset the clock."
				/>
			{/if}
		</section>
	{/if}
</div>
