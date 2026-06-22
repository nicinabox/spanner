<script lang="ts">
	import VehicleLink from '$lib/components/vehicles/VehicleLink.svelte';
	import Stat from '$lib/components/common/Stat.svelte';
	import { sortVehiclesBy } from '$lib/utils/sortable';
	import { formatMileage } from '$lib/utils/vehicle';
	import type { DistanceUnit, Sortable, Vehicle } from '$lib/data/vehicles';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let sortable: Sortable = $derived(
		data.user?.preferences.vehiclesSortOrder ?? ['created_at', 'desc']
	);

	let active = $derived(data.vehicles.filter((v) => !v.retired));
	let sorted = $derived(sortVehiclesBy(active, sortable));

	let vehiclesByDistanceUnit = $derived(
		Object.entries(Object.groupBy(active, (v) => v.distanceUnit)) as [DistanceUnit, Vehicle[]][]
	);
</script>

<div class="mb-6 flex justify-start gap-16 overflow-auto pointer-coarse:no-scrollbar">
	<Stat title="Active vehicles" value={active.length} />

	{#each vehiclesByDistanceUnit as [distanceUnit, vehicles] (distanceUnit)}
		{@const total = vehicles.reduce((acc, v) => acc + (v.milesPerYear ?? 0), 0)}
		<Stat title={`Total ${distanceUnit} per year`} value={formatMileage(total, distanceUnit)} />
	{/each}
</div>

<section>
	<h1 class="text-xl mb-4">Vehicles</h1>

	{#if sorted.length === 0}
		<p class="text-subtle">No vehicles yet. Add one to get started.</p>
	{:else}
		<ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{#each sorted as vehicle (vehicle.id)}
				<li class="flex">
					<VehicleLink {vehicle} />
				</li>
			{/each}
		</ul>
	{/if}
</section>
