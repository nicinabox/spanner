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
	import TextField from '$lib/components/TextField.svelte';

	let { data }: PageProps = $props();

	const view = $derived(page.url.searchParams.get('view') ?? 'history');
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

				<div class="flex">
					<TextField
						name="search"
						placeholder="Search history"
						class="mb-4 ml-auto w-full justify-self-end sm:w-1/2 lg:w-1/3"
					/>
				</div>

				<HistoryTable vehicle={data.vehicle} history={data.history} />
			{:else}
				<EmptyState
					heading="Add your vehicle's history"
					details="Try adding your purchase as the first record."
				>
					{#snippet action()}
						<a
							class="btn btn-primary"
							href={resolve(`/vehicles/${data.vehicle.id}/add?notes=Purchase`)}
						>
							Add Purchase
						</a>
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
				<Markdown src={data.vehicle.notes} />
			{:else}
				<EmptyState
					heading="Notes are for hard-to-remember things"
					details="Add tire pressures, oil capacity, or how to reset the clock."
				/>
			{/if}
		</section>
	{/if}
</div>
