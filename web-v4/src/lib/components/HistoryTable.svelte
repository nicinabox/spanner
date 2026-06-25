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
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import { formatCurrency } from '$lib/utils/number';
	import { calculateDeltaMileage, sortNewestDateFirst } from '$lib/utils/records';
	import { Eye, EyeClosed } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Button from './common/Button.svelte';
	import { pluralize } from '$lib/utils/text';

	interface Props {
		history: HistoryEntry[];
		vehicle: Vehicle;
	}

	let { history, vehicle }: Props = $props();

	let showMileageAdjustments = $state(vehicle.preferences.showMileageAdjustmentRecords);

	const historyNewestFirst = $derived(
		history
			.filter((r) => showMileageAdjustments || r.recordType !== 'mileage adjustment')
			.toSorted(sortNewestDateFirst),
	);

	const allYears = $derived(
		Object.keys(Object.groupBy(history, (r) => new Date(r.date).getFullYear())),
	);

	const hiddenCounts = $derived(
		Object.fromEntries(
			allYears.map((y) => {
				const year = Number(y);
				const count = history.filter(
					(r) => new Date(r.date).getFullYear() === year && r.recordType === 'mileage adjustment',
				).length;
				return [y, count];
			}),
		) as Record<string, number>,
	);

	const groupedRecords = $derived(
		Object.groupBy(historyNewestFirst, (record) => new Date(record.date).getFullYear()),
	);

	const years = $derived(allYears.toSorted((a, b) => Number(b) - Number(a)));

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
		class="history-table group mb-6 overflow-clip rounded-sm bg-surface shadow-sm"
	>
		<div class="sticky-sentinel"></div>
		<header
			class="sticky top-0 z-10 flex rounded-t-[inherit] bg-inherit px-4 py-2 group-data-[state=top]:rounded-t-none group-data-[state=top]:shadow-sm"
		>
			<h2 class="text-lg font-semibold m-0">{year}</h2>
			{#if hiddenCounts[year] > 0}
				<div class="ml-auto">
					<Tooltip
						content={showMileageAdjustments
							? 'Hide mileage adjustments'
							: `Show ${hiddenCounts[year]} hidden ${pluralize('record', hiddenCounts[year])}`}
					>
						{#snippet children(triggerProps)}
							<Button
								{...triggerProps}
								size="sm"
								variant="ghost"
								onclick={() => (showMileageAdjustments = !showMileageAdjustments)}
								class="flex items-center gap-1 text-xs text-ink-400 hover:text-ink-600 transition-colors"
							>
								<span>{hiddenCounts[year]}</span>
								{#if showMileageAdjustments}
									<Eye size={14} />
								{:else}
									<EyeClosed size={14} />
								{/if}
							</Button>
						{/snippet}
					</Tooltip>
				</div>
			{/if}
		</header>
		<FlexTable class="border-t-2 border-ink-200">
			<Row class="text-xs font-bold tracking-wide text-ink-400 uppercase max-sm:hidden">
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
							day: 'numeric',
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
