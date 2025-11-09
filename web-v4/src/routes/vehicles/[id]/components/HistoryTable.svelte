<script lang="ts">
	import { intlFormat } from 'date-fns';
	import { type HistoryEntry } from '$lib/data/history';
	import { parseDateUTC } from '$lib/utils/date';
	import { formatMileage, sortNewestDateFirst } from '$lib/utils/vehicle';
	import type { DistanceUnit } from '$lib/data/vehicles';

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
		<div class="flex w-full flex-col flex-nowrap py-2 md:table">
			<div class="flex flex-row flex-nowrap text-xs font-bold uppercase md:table-row">
				<div
					class="flex w-fit flex-col flex-nowrap justify-start px-4 py-2 whitespace-nowrap md:table-cell"
				>
					Date
				</div>
				<div
					class="flex w-fit flex-col flex-nowrap justify-start px-4 py-2 whitespace-nowrap md:table-cell"
				>
					Mileage
				</div>
				<div class="flex flex-col flex-nowrap justify-start px-4 py-2 md:table-cell">Notes</div>
			</div>

			{#each groupedRecords[Number(year)] as record (record.id)}
				<div class="flex flex-row flex-nowrap md:table-row">
					<div
						class="flex w-fit flex-col flex-nowrap justify-start px-4 py-2 whitespace-nowrap md:table-cell"
					>
						{intlFormat(parseDateUTC(record.date), {
							month: 'short',
							day: 'numeric'
						})}
					</div>
					<div
						class="flex w-fit flex-col flex-nowrap justify-start px-4 py-2 whitespace-nowrap md:table-cell"
					>
						{formatMileage(record.mileage, distanceUnit)}
					</div>
					<div class="flex w-full flex-col flex-nowrap justify-start px-4 py-2 md:table-cell">
						{record.notes}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/each}
