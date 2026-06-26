<script lang="ts">
	import AppBar from '$lib/components/common/AppBar.svelte';
	import HistoryTable from '$lib/components/HistoryTable.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Stat from '$lib/components/common/Stat.svelte';
	import { BookOpenText } from 'lucide-svelte';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let history = $derived(data.history.filter((r) => r.recordType !== 'mileage adjustment'));
</script>

<svelte:head>
	<title>{pageTitle(vehicle.name)}</title>
</svelte:head>

<AppBar />

<div class="max-w-6xl mx-auto px-(--main-padding) py-6">
	<header class="mb-6">
		<h1 class="text-2xl font-semibold">{vehicle.name}</h1>
	</header>

	{#if history.length}
		<div class="mb-6 flex gap-12 overflow-auto pointer-coarse:no-scrollbar">
			<Stat title="Since" value={intlFormatDateUTC(history[0].date)} />
			<Stat
				title="Mileage"
				value={`${vehicle.estimatedMileage?.toLocaleString()} ${vehicle.distanceUnit}`}
			/>
		</div>

		<HistoryTable {history} {vehicle} editable={false} />
	{:else}
		<EmptyState heading="No history yet" details="This vehicle doesn't have any service records.">
			{#snippet media()}
				<BookOpenText size={48} class="text-ink-300" />
			{/snippet}
		</EmptyState>
	{/if}
</div>
