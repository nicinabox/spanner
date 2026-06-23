<script lang="ts">
	import { intlFormat } from 'date-fns';
	import { type HistoryEntry } from '$lib/data/history';
	import { parseDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';
	import type { Vehicle } from '$lib/data/vehicles';
	import FlexTable from '$lib/components/FlexTable/Table.svelte';
	import Row from '$lib/components/FlexTable/Row.svelte';
	import Cell from '$lib/components/FlexTable/Cell.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import { formatCurrency } from '$lib/utils/number';
	import { calculateDeltaMileage, sortNewestDateFirst } from '$lib/utils/records';
	import { onMount } from 'svelte';

	interface Props {
		history: HistoryEntry[];
		vehicle: Vehicle;
	}

	let { history, vehicle }: Props = $props();

	const historyNewestFirst = $derived(history.toSorted(sortNewestDateFirst));

	const groupedRecords = $derived(
		Object.groupBy(historyNewestFirst, (record) => new Date(record.date).getFullYear())
	);

	const years = $derived(Object.keys(groupedRecords).sort((a, b) => Number(b) - Number(a)));

	onMount(() => {
		const observer = new IntersectionObserver(([entry]) => {
			const root = entry.target.parentNode as HTMLElement | null;
			if (root) {
				if (entry.isIntersecting) {
					delete root.dataset.state;
				} else {
					root.dataset.state = 'top';
				}
			}
		});

		const elements = document.querySelectorAll('.sticky-sentinel');

		elements.forEach((element) => {
			observer.observe(element);
		});

		return () => observer.disconnect();
	});
</script>

{#each years as year (year)}
	<div
		id={`year-${year}`}
		class="history-table group mb-8 overflow-clip rounded-md bg-surface shadow-sm"
	>
		<div class="sticky-sentinel"></div>
		<header
			class="sticky top-0 z-10 flex rounded-t-[inherit] bg-inherit px-4 py-2 group-data-[state=top]:rounded-t-none group-data-[state=top]:shadow-sm"
		>
			<h2 class="text-lg font-semibold m-0">{year}</h2>
		</header>
		<FlexTable class="border-t-2 border-ink-200">
			<Row class="text-xs font-bold tracking-wide text-ink-500 uppercase max-sm:hidden">
				<Cell>Date</Cell>
				<Cell>Distance</Cell>
				{#if vehicle.preferences.enableCost}
					<Cell>Cost</Cell>
				{/if}
				<Cell>Notes</Cell>
				<Cell />
			</Row>

			{#each groupedRecords[Number(year)] as record (record.id)}
				{@const deltaMileage = calculateDeltaMileage(record, historyNewestFirst)}

				<Row class="text-md even:bg-ink-50 max-sm:gap-1">
					<Cell class="whitespace-nowrap max-sm:text-sm max-sm:font-bold">
						{intlFormat(parseDateUTC(record.date), {
							month: 'short',
							day: 'numeric'
						})}
					</Cell>
					<Cell class="w-fit items-baseline gap-2 text-right whitespace-nowrap max-sm:text-sm">
						{formatMileage(record.mileage, vehicle.distanceUnit)}

						<span class="block text-xs text-ink-400">
							(+{deltaMileage})
						</span>
					</Cell>
					{#if vehicle.preferences.enableCost}
						<Cell class="ml-auto text-right tabular-nums max-sm:text-sm">
							{record.cost ? formatCurrency(Number(record.cost)) : '--'}
						</Cell>
					{/if}
					<Cell class="w-full max-sm:py-1">
						<Markdown src={record.notes} />
					</Cell>
					<Cell class="ml-auto">
						<a
							class="text-sm underline text-brand-500 hover:text-brand-600"
							href={`/vehicles/${vehicle.id}/history/${record.id}/edit`}
						>
							Edit
						</a>
					</Cell>
				</Row>
			{/each}
		</FlexTable>
	</div>
{/each}
