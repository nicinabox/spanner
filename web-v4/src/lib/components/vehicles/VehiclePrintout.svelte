<script lang="ts">
	import type { HistoryEntry } from '#lib/data/history.ts';
	import type { Vehicle } from '#lib/data/vehicles.ts';
	import Markdown from '#lib/components/Markdown.svelte';
	import { intlFormatDateUTC } from '#lib/utils/date.ts';
	import { formatCurrency } from '#lib/utils/number.ts';
	import { formatEstimatedMileage, formatMileage } from '#lib/utils/vehicle.ts';

	interface Props {
		vehicle: Vehicle;
		history: HistoryEntry[];
	}

	let { vehicle, history }: Props = $props();

	// A service book reads forward in time. Mileage adjustments are bookkeeping, not service.
	const records = $derived(
		history
			.filter((record) => record.recordType !== 'mileage adjustment')
			.toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
	);

	const years = $derived(Object.groupBy(records, (record) => new Date(record.date).getFullYear()));

	const span = $derived(
		records.length > 1
			? `${intlFormatDateUTC(records[0]!.date)} – ${intlFormatDateUTC(records.at(-1)!.date)}`
			: null,
	);
</script>

<article class="bg-white text-black mx-auto max-w-[7.5in] px-6 py-8 print:p-0">
	<header class="mb-8">
		<h1 class="text-2xl font-semibold">{vehicle.name}</h1>
		<dl class="mt-2 flex flex-wrap gap-x-8 gap-y-1 text-sm">
			{#if vehicle.vin}
				<div class="flex gap-2">
					<dt class="text-black/50">VIN</dt>
					<dd class="tabular-nums">{vehicle.vin}</dd>
				</div>
			{/if}
			<div class="flex gap-2">
				<dt class="text-black/50">Mileage</dt>
				<dd class="tabular-nums">{formatEstimatedMileage(vehicle)}</dd>
			</div>
			{#if span}
				<div class="flex gap-2">
					<dt class="text-black/50">Records</dt>
					<dd class="tabular-nums">{span}</dd>
				</div>
			{/if}
		</dl>
	</header>

	{#if records.length}
		{#each Object.entries(years) as [year, yearRecords] (year)}
			<section class="mb-6">
				<h2 class="mb-2 text-xs font-semibold tracking-wider uppercase text-black/50">{year}</h2>
				<ul class="flex flex-col gap-4">
					{#each yearRecords as record (record.id)}
						<li class="break-inside-avoid border-t border-black/15 pt-3">
							<div class="flex items-baseline justify-between gap-6 text-sm">
								<span class="font-medium">{intlFormatDateUTC(record.date)}</span>
								<span class="flex gap-4 tabular-nums text-black/70">
									{#if record.mileage !== null}
										<span>{formatMileage(record.mileage, vehicle.distanceUnit)}</span>
									{/if}
									{#if vehicle.preferences.enableCost && record.cost}
										<span>{formatCurrency(Number(record.cost))}</span>
									{/if}
								</span>
							</div>
							{#if record.classifications?.length}
								<p class="mt-1 text-xs text-black/50">
									{record.classifications.map((c) => c.name).join(' · ')}
								</p>
							{/if}
							<div class="mt-1 printout-notes">
								<Markdown src={record.notes} headingLevels={{ offset: 1, min: 4, max: 6 }} />
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	{:else}
		<p class="text-sm text-black/50">No service records.</p>
	{/if}
</article>

<style>
	/* @page has no selectors, so Svelte leaves it unscoped and it applies to this document. */
	@page {
		size: letter;
		margin: 16mm;
	}

	/* Note bodies are rendered by Markdown with no prose class, and preflight strips list
	   markers, so give the printed artifact document-grade typography. */
	article :global(.printout-notes p) {
		margin: 0.25rem 0 0;
	}

	article :global(.printout-notes ul),
	article :global(.printout-notes ol) {
		margin: 0.25rem 0 0;
		padding-left: 1.25rem;
	}

	article :global(.printout-notes ul) {
		list-style: disc;
	}

	article :global(.printout-notes ol) {
		list-style: decimal;
	}

	@media print {
		/* Notes may contain links; the URL is meaningless on paper. */
		article :global(a) {
			text-decoration: none;
			color: inherit;
		}
	}
</style>
