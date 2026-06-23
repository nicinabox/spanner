<script lang="ts">
	import { Button } from '$lib';
	import PageLayout from '$lib/components/common/PageLayout.svelte';
	import Stat from '$lib/components/common/Stat.svelte';
	import HistoryTable from '$lib/components/HistoryTable.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { ArrowLeft, BookOpenText } from 'lucide-svelte';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import type { PageProps } from './$types';
	import Menu from '$lib/components/common/Menu.svelte';
	import VehicleColorIndicator from '$lib/components/vehicles/VehicleColorIndicator.svelte';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let history = $derived(data.history);
</script>

<PageLayout>
	{#snippet header()}
		<div class="flex gap-2">
			<Button href="/vehicles" variant="neutral" theme="dark">
				<ArrowLeft size={16} /> Vehicles
			</Button>

			<Menu
				variant="tertiary"
				theme="dark"
				items={[
					{ value: 'edit', label: 'Edit', href: `/vehicles/${vehicle.id}/edit` },
					{ value: 'color', label: 'Change Color' },
					{ value: 'retire', label: 'Retire' }
				]}
			>
				{#snippet trigger()}
					<VehicleColorIndicator color={vehicle.color} size={6} /> {vehicle.name}
				{/snippet}
			</Menu>
		</div>
	{/snippet}

	<div class="max-w-6xl mx-auto">
		<div
			class="mb-6 flex justify-between gap-12 md:gap-16 overflow-auto pointer-coarse:no-scrollbar"
		>
			<Stat
				title="Estimated mileage"
				value={vehicle.estimatedMileage
					? `${vehicle.estimatedMileage.toLocaleString()} ${vehicle.distanceUnit}`
					: null}
			/>
			<Stat
				title="Mileage rate"
				value={vehicle.milesPerYear
					? `${vehicle.milesPerYear.toLocaleString()} ${vehicle.distanceUnit}/yr`
					: null}
			/>
			<Stat title="Since" value={history[0] ? intlFormatDateUTC(history[0].date) : null} />
			<Stat title="VIN" value={vehicle.vin} />
		</div>

		{#if history.length}
			<HistoryTable {history} {vehicle} />
		{:else}
			<EmptyState
				heading="Add your vehicle's history"
				details="Try adding your purchase as the first record"
			>
				{#snippet media()}
					<BookOpenText size={48} class="text-ink-300" />
				{/snippet}
				{#snippet action()}
					<Button size="lg" href="/vehicles/{vehicle.id}/add?notes=Purchase">Add Purchase</Button>
				{/snippet}
			</EmptyState>
		{/if}
	</div>
</PageLayout>
