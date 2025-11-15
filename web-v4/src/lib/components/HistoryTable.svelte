<script lang="ts">
	import { intlFormat } from 'date-fns';
	import { type HistoryEntry } from '$lib/data/history';
	import { parseDateUTC } from '$lib/utils/date';
	import { formatMileage, sortNewestDateFirst } from '$lib/utils/vehicle';
	import type { DistanceUnit, Vehicle } from '$lib/data/vehicles';
	import FlexTable from '$lib/components/FlexTable/Table.svelte';
	import Row from '$lib/components/FlexTable/Row.svelte';
	import Cell from '$lib/components/FlexTable/Cell.svelte';
	import { resolve } from '$app/paths';
	import Markdown from './Markdown.svelte';

	interface Props {
		history: HistoryEntry[];
		vehicle: Vehicle;
	}

	let { history, vehicle }: Props = $props();

	const groupedRecords = Object.groupBy(history.toSorted(sortNewestDateFirst), (record) =>
		new Date(record.date).getFullYear()
	);

	const years = Object.keys(groupedRecords).sort((a, b) => Number(b) - Number(a));
</script>

{#each years as year (year)}
	<div class="mb-4 overflow-hidden rounded-lg bg-base-200 shadow-sm">
		<heading class="flex border-b-2 border-base-300 px-4 py-2">
			<h2 class="h2 m-0">{year}</h2>
		</heading>
		<FlexTable>
			<Row class="text-xs font-bold tracking-wide text-current/70 uppercase max-sm:hidden">
				<Cell>Date</Cell>
				<Cell>Mileage</Cell>
				<Cell>Notes</Cell>
				<Cell />
			</Row>

			{#each groupedRecords[Number(year)] as record (record.id)}
				<Row class="group text-[1rem] even:bg-base-300 max-sm:gap-1">
					<Cell class="whitespace-nowrap max-sm:text-sm max-sm:font-bold">
						{intlFormat(parseDateUTC(record.date), {
							month: 'short',
							day: 'numeric'
						})}
					</Cell>
					<Cell class="whitespace-nowrap max-sm:text-sm">
						{formatMileage(record.mileage, vehicle.distanceUnit)}
					</Cell>
					<Cell class="w-full">
						<Markdown src={record.notes} />
					</Cell>
					<Cell>
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
