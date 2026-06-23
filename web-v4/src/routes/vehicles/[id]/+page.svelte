<script lang="ts">
	import { Button } from '$lib';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
</script>

<div class="max-w-xl mx-auto">
	<div class="flex items-start justify-between mb-6">
		<div>
			<h1 class="text-xl">{vehicle.name}</h1>
			<p class="text-sm text-ink-500">
				{vehicle.estimatedMileage} {vehicle.distanceUnit} &bull; {vehicle.milesPerYear} {vehicle.distanceUnit}/yr
			</p>
		</div>
		<Button href="/vehicles/{vehicle.id}/edit" variant="tertiary">Edit</Button>
	</div>
</div>
