<script lang="ts">
	import VehicleLink from '$lib/components/vehicles/VehicleLink.svelte';
	import { sortVehiclesBy } from '$lib/utils/sortable';
	import type { Sortable } from '$lib/data/vehicles';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let sortable: Sortable = $derived(data.user?.preferences.vehiclesSortOrder ?? ['created_at', 'desc']);

	let active = $derived(data.vehicles.filter((v) => !v.retired));
	let sorted = $derived(sortVehiclesBy(active, sortable));
</script>

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