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
	import AttachmentList from './attachments/AttachmentList.svelte';
	import Badge from './common/Badge.svelte';

	interface Props {
		history: HistoryEntry[];
		vehicle: Vehicle;
		editable?: boolean;
	}

	let { history, vehicle, editable = true }: Props = $props();

	let showAdjustments = $derived(vehicle.preferences.showMileageAdjustmentRecords);

	const historyNewestFirst = $derived(
		history
			.filter((r) => showAdjustments || r.recordType !== 'mileage adjustment')
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
		const appbarHeight =
			parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--appbar-height')) ||
			56;

		const observer = new IntersectionObserver(
			([entry]) => {
				const root = entry.target.parentNode as HTMLElement | null;
				if (root) {
					if (entry.isIntersecting) {
						delete root.dataset.state;
					} else {
						root.dataset.state = 'top';
					}
				}
			},
			{ rootMargin: `-${appbarHeight}px 0px 0px 0px` },
		);

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
		class="history-table overflow-clip group mb-6 rounded-sm bg-surface-raised shadow-sm"
	>
		<div class="sticky-sentinel h-px"></div>
		<header
			class="sticky top-(--appbar-height) z-10 items-center flex rounded-t-[inherit] bg-inherit px-4 py-2 group-data-[state=top]:rounded-t-none group-data-[state=top]:shadow-sm"
		>
			<h2 class="text-lg font-semibold m-0">{year}</h2>
			{#if hiddenCounts[year] > 0}
				<div class="ml-auto">
					<Tooltip
						content={showAdjustments
							? 'Hide mileage adjustments'
							: `Show ${hiddenCounts[year]} hidden ${pluralize('record', hiddenCounts[year])}`}
					>
						{#snippet children(triggerProps)}
							<Button
								{...triggerProps}
								size="xs"
								color="neutral"
								variant="ghost"
								onclick={() => (showAdjustments = !showAdjustments)}
							>
								<span>{hiddenCounts[year]}</span>
								{#if showAdjustments}
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
		<FlexTable class="border-t border-ink-200">
			<Row
				class="text-xs font-medium tracking-wide text-ink-400 uppercase max-sm:hidden only:hidden"
			>
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

				<Row class="text-md even:bg-gray-100 dark:even:bg-surface max-sm:gap-1">
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
						<Cell class="max-sm:ml-auto text-right tabular-nums max-sm:text-sm">
							{record.cost ? formatCurrency(Number(record.cost)) : '--'}
						</Cell>
					{/if}
					<Cell class="w-full max-sm:order-2 max-sm:py-1 flex flex-col">
						<Markdown src={record.notes} />
						{#if record.classifications?.length}
							<div class="flex flex-wrap gap-1 mt-1">
								{#each record.classifications as c}
									<Badge variant="neutral">{c.name}</Badge>
								{/each}
							</div>
						{/if}
						{#if record.attachments.length > 0}
							<div class="mt-2">
								<AttachmentList attachments={record.attachments} />
							</div>
						{/if}
					</Cell>
					<Cell class="max-sm:order-1 {!vehicle.preferences.enableCost ? 'max-sm:ml-auto' : ''}">
						{#if editable}
							<Button
								size="xs"
								variant="ghost"
								href={`/vehicles/${vehicle.id}/history/${record.id}/edit`}
							>
								Edit
							</Button>
						{/if}
					</Cell>
				</Row>
			{/each}
		</FlexTable>
	</div>
{/each}
