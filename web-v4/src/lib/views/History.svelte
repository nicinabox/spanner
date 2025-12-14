<script lang="ts">
	import { page } from '$app/state';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import HistoryTable from '$lib/components/HistoryTable.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { HistoryEntry } from '$lib/data/history';
	import type { Vehicle } from '$lib/data/vehicles';
	import { parseDateUTC } from '$lib/utils/date';
	import { formatEstimatedMileage, formatMilesPerYear } from '$lib/utils/vehicle';
	import { intlFormat } from 'date-fns';
	import { BookOpenText, PlusIcon } from 'lucide-svelte';

	interface Props {
		history: HistoryEntry[];
		vehicle: Vehicle;
	}

	let props: Props = $props();

	let searchQuery = $state('');
	let history = $derived.by(() => {
		if (!searchQuery) return props.history;
		return props.history.filter((item) =>
			JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
		);
	});
</script>

{#if props.history.length}
	<header class="my-8">
		<div class="flex justify-between gap-16 overflow-auto pointer-coarse:no-scrollbar">
			<Stat title="Estimated Mileage" value={formatEstimatedMileage(props.vehicle)} />
			<Stat title="Mileage Rate" value={formatMilesPerYear(props.vehicle)} />
			<Stat
				title="Since"
				value={intlFormat(parseDateUTC(props.history[0]?.date), {
					month: 'short',
					year: 'numeric',
					day: 'numeric'
				})}
			/>
			<Stat title="VIN" value={props.vehicle.vin} />
		</div>
	</header>

	<div class="flex justify-between gap-10">
		<Input
			type="search"
			name="search"
			placeholder="Search history"
			class="mb-4 w-full sm:w-1/2 lg:w-1/3"
			bind:value={searchQuery}
			onfocus={(e) => e.target?.select()}
		/>

		<Button class="ml-auto" href={`/vehicles/${page.params.id}/add`}>
			<PlusIcon size={16} />
			New...
		</Button>
	</div>

	<HistoryTable vehicle={props.vehicle} {history} />
{:else}
	<EmptyState
		heading="Add your vehicle's history"
		details="Try adding your purchase as the first record"
	>
		{#snippet media()}
			<BookOpenText size={48} class="text-accent-foreground" />
		{/snippet}

		{#snippet action()}
			<Button href={`/vehicles/${props.vehicle.id}/add?notes=Purchase`}>Add Purchase</Button>
		{/snippet}
	</EmptyState>
{/if}
