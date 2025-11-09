<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import VehicleLink from './components/VehicleLink.svelte';

	let { data }: PageProps = $props();

	let active = data.vehicles.filter((v) => !v.retired);
	let retired = data.vehicles.filter((v) => v.retired);

	let showRetired = $state(false);
</script>

<h1 class="h1">Vehicles</h1>

<section>
	<ul class="grid grid-cols-4 gap-4">
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

	<ul class:hidden={!showRetired} class="grid grid-cols-4 gap-4">
		{#each retired as v (v.id)}
			<li class="flex">
				<VehicleLink {...v} />
			</li>
		{/each}
	</ul>
</section>
