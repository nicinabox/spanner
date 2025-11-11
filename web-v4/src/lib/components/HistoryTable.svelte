<script lang="ts">
	import { intlFormat } from 'date-fns';
	import { type HistoryEntry } from '$lib/data/history';
	import { parseDateUTC } from '$lib/utils/date';
	import { formatMileage, sortNewestDateFirst } from '$lib/utils/vehicle';
	import type { DistanceUnit } from '$lib/data/vehicles';
	import FlexTable from '$lib/components/FlexTable/Table.svelte';
	import Row from '$lib/components/FlexTable/Row.svelte';
	import Cell from '$lib/components/FlexTable/Cell.svelte';

	interface Props {
		history: HistoryEntry[];
		distanceUnit: DistanceUnit;
	}

	let { history, distanceUnit }: Props = $props();

	const groupedRecords = Object.groupBy(history.toSorted(sortNewestDateFirst), (record) =>
		new Date(record.date).getFullYear()
	);

	const years = Object.keys(groupedRecords).sort((a, b) => Number(b) - Number(a));
</script>

{#each years as year (year)}
	<div class="mb-4 overflow-hidden rounded-md bg-base-200 shadow-sm">
		<heading class="flex bg-base-300 px-4 py-2">
			<h2 class="h2 m-0">{year}</h2>
		</heading>
		<FlexTable>
			<Row class="text-xs font-bold uppercase max-sm:hidden">
				<Cell>Date</Cell>
				<Cell>Mileage</Cell>
				<Cell>Notes</Cell>
			</Row>

			{#each groupedRecords[Number(year)] as record (record.id)}
				<Row>
					<Cell class="whitespace-nowrap">
						{intlFormat(parseDateUTC(record.date), {
							month: 'short',
							day: 'numeric'
						})}
					</Cell>
					<Cell class="whitespace-nowrap">
						{formatMileage(record.mileage, distanceUnit)}
					</Cell>
					<Cell class="w-full">
						{record.notes}
					</Cell>
				</Row>
			{/each}
		</FlexTable>
	</div>
{/each}
