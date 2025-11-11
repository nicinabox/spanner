<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import VehicleLink from '$lib/components/VehicleLink.svelte';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	let active = data.vehicles.filter((v) => !v.retired);
	let retired = data.vehicles.filter((v) => v.retired);

	let showRetired = $state(false);
</script>

<header class="flex justify-between">
	<h1 class="h1">Vehicles</h1>
	<a class="btn btn-ghost" href={resolve('/vehicles/new')}>+ New</a>
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
	<button class="btn my-4 btn-ghost btn-sm" onclick={() => (showRetired = !showRetired)}>
		{showRetired ? 'Hide' : 'Show'} retired
		<ChevronRight size={16} class={showRetired ? 'rotate-90' : ''} />
	</button>

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
