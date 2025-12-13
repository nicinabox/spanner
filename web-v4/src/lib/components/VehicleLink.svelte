<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Vehicle } from '$lib/data/vehicles';
	import { getOverdueRemindersCount } from '$lib/utils/reminders';
	import { pluralize } from '$lib/utils/text';
	import { formatMileage } from '$lib/utils/vehicle';
	import { Wrench } from 'lucide-svelte';
	import VehicleColor from './VehicleColor.svelte';

	const vehicle: Vehicle = $props();
	const { id, name, milesPerYear, estimatedMileage, distanceUnit } = vehicle;

	let overdueRemindersCount = getOverdueRemindersCount(vehicle);
</script>

<a
	href={resolve(`/vehicles/${id}`)}
	class="min-h-[110px] flex-1 rounded-md bg-primary p-4 text-primary-foreground shadow-sm hover:brightness-75"
>
	<div class="mb-3 flex items-start justify-between">
		<VehicleColor color={vehicle.color ?? '#ffffff'} />
		{#if overdueRemindersCount}
			<span
				title={pluralize(overdueRemindersCount, 'overdue reminder', 'overdue reminders')}
				class="badge text-amber-500"
			>
				<Wrench size={16} />
				{overdueRemindersCount}
			</span>
		{/if}
	</div>

	<div class="flex flex-col">
		<h2 class="font-medium">{name}</h2>

		<span class="text-sm text-primary-foreground/60">
			<span>{formatMileage(estimatedMileage, distanceUnit)}</span>
			&bull;
			<span>{formatMileage(milesPerYear, distanceUnit)}/yr</span>
		</span>
	</div>
</a>
