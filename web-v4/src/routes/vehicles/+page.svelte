<script lang="ts">
	import { ChevronRight, PlusIcon } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import VehicleLink from '$lib/components/VehicleLink.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import { formatMileage } from '$lib/utils/vehicle';
	import type { DistanceUnit, Vehicle } from '$lib/data/vehicles';
	import VehicleSortMenu from '$lib/components/VehicleSortMenu.svelte';

	let { data }: PageProps = $props();

	let active = data.vehicles.filter((v) => !v.retired);
	let retired = data.vehicles.filter((v) => v.retired);

	let showRetired = $state(false);

	let vehiclesByDistanceUnit = Object.entries(Object.groupBy(active, (v) => v.distanceUnit)) as [
		DistanceUnit,
		Vehicle[]
	][];
</script>

<div class="mb-6 flex justify-start gap-16 overflow-auto pointer-coarse:no-scrollbar">
	<Stat title="Active vehicles" value={active.length} />

	{#each vehiclesByDistanceUnit as [distanceUnit, vehicles] (distanceUnit)}
		{@const total = vehicles.reduce((acc, v) => acc + (v.milesPerYear ?? 0), 0)}
		<Stat title={`Total ${distanceUnit} per year`} value={formatMileage(total, distanceUnit)} />
	{/each}
</div>

<header class="mb-2 flex items-center justify-between">
	<h1 class="h2">Vehicles</h1>

	<div class="flex gap-2">
		<Button href="/vehicles/new" variant="ghost" size="sm">
			<PlusIcon /> New
		</Button>

		<VehicleSortMenu sortable={data.user.preferences.vehiclesSortOrder} onSelect={console.log} />
	</div>
</header>

<section>
	<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each active as v (v.id)}
			<li class="flex">
				<VehicleLink {...v} />
			</li>
		{/each}
	</ul>
</section>

<section class="mt-8">
	<Button
		aria-pressed={showRetired}
		class="my-4"
		variant="outline"
		onclick={() => (showRetired = !showRetired)}
	>
		{showRetired ? 'Hide' : 'Show'} retired
		<ChevronRight size={16} class={showRetired ? 'rotate-90' : ''} />
	</Button>

	<ul
		class:hidden={!showRetired}
		class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
	>
		{#each retired as v (v.id)}
			<li class="flex">
				<VehicleLink {...v} />
			</li>
		{/each}
	</ul>
</section>
