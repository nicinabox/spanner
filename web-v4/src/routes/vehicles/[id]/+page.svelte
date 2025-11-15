<script lang="ts">
	import { marked } from 'marked';
	import insane from 'insane';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import Stat from '$lib/components/Stat.svelte';
	import { formatEstimatedMileage, formatMilesPerYear } from '$lib/utils/vehicle';
	import HistoryTable from '$lib/components/HistoryTable.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { resolve } from '$app/paths';
	import Markdown from '$lib/components/Markdown.svelte';

	let { data }: PageProps = $props();

	const view = $derived(page.url.searchParams.get('view') ?? 'history');
</script>

<div>
	{#if view === 'history'}
		<section class="my-8" id="history">
			{#if data.history.length}
				<header class="my-8">
					<div class="flex gap-8 overflow-auto">
						<Stat title="Estimated Mileage" value={formatEstimatedMileage(data.vehicle)} />
						<Stat title="Mileage Rate" value={formatMilesPerYear(data.vehicle)} />
						<Stat title="Since" value={new Date(data.vehicle.createdAt).getFullYear()} />
						<Stat title="VIN" value={data.vehicle.vin} />
					</div>

					<div class="my-4 flex justify-between">
						<a class="btn ml-auto btn-primary" href={resolve(`/vehicles/${data.vehicle.id}/add`)}>
							Add...
						</a>
					</div>
				</header>

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
