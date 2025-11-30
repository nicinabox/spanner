<script lang="ts">
	import { intlFormat } from 'date-fns';
	import { type HistoryEntry } from '$lib/data/history';
	import { parseDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';
	import type { Vehicle } from '$lib/data/vehicles';
	import FlexTable from '$lib/components/FlexTable/Table.svelte';
	import Row from '$lib/components/FlexTable/Row.svelte';
	import Cell from '$lib/components/FlexTable/Cell.svelte';
	import { resolve } from '$app/paths';
	import Markdown from './Markdown.svelte';
	import { formatCurrency } from '$lib/utils/number';
	import { calculateDeltaMileage, sortNewestDateFirst } from '$lib/utils/records';

	interface Props {
		history: HistoryEntry[];
		vehicle: Vehicle;
	}

	let { history, vehicle }: Props = $props();

	const historyNewestFirst = history.toSorted(sortNewestDateFirst);

	const groupedRecords = Object.groupBy(historyNewestFirst, (record) =>
		new Date(record.date).getFullYear()
	);

	const years = Object.keys(groupedRecords).sort((a, b) => Number(b) - Number(a));
</script>

{#each years as year (year)}
	<div class="mb-8 bg-white shadow-md dark:bg-gray-700">
		<heading
			class="sticky top-0 z-10 flex border-b-2 border-gray-100 bg-inherit px-4 py-2 dark:border-gray-800"
		>
			<h2 class="h2 m-0">{year}</h2>
		</heading>
		<FlexTable>
			<Row class="text-xs font-bold tracking-wide text-current/70 uppercase max-sm:hidden">
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

				<Row class="group text-md even:bg-gray-100 max-sm:gap-1 dark:even:bg-gray-800">
					<Cell class="whitespace-nowrap max-sm:text-sm max-sm:font-bold">
						{intlFormat(parseDateUTC(record.date), {
							month: 'short',
							day: 'numeric'
						})}
					</Cell>
					<Cell class="w-fit items-baseline gap-2 text-right whitespace-nowrap max-sm:text-sm">
						{formatMileage(record.mileage, vehicle.distanceUnit)}
						{#if deltaMileage}
							<span class="block text-xs text-muted-foreground">
								(+{deltaMileage})
							</span>
						{/if}
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
							class="text-sm underline"
							href={resolve(`/vehicles/${vehicle.id}/history/${record.id}/edit`)}
						>
							Edit
						</a>
					</Cell>
				</Row>
			{/each}
		</FlexTable>
	</div>
{/each}
