<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Vehicle } from '$lib/data/vehicles';
	import { formatMileage } from '$lib/utils/vehicle';

	const { id, name, milesPerYear, estimatedMileage, distanceUnit }: Vehicle = $props();
</script>

<a href={resolve(`/vehicles/${id}`)} class="flex-1 rounded-md bg-base-200 p-4 shadow-sm">
	<h2 class="font-medium">{name}</h2>

	<span class="text-sm text-gray-500">
		<span>{formatMileage(estimatedMileage, distanceUnit)}</span>
		&bull;
		<span>{formatMileage(milesPerYear, distanceUnit)}/yr</span>
	</span>
</a>
