<script lang="ts">
	import { Wrench } from 'lucide-svelte';
	import Badge from '$lib/components/common/Badge.svelte';
	import VehicleColorIndicator from './VehicleColorIndicator.svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { getUnifiedOverdueCount } from '$lib/utils/tasks';
	import { formatMileage } from '$lib/utils/vehicle';

	interface Props {
		vehicle: Vehicle;
	}

	let { vehicle }: Props = $props();

	let { id, name, milesPerYear, estimatedMileage, distanceUnit } = $derived(vehicle);

	let overdue = $derived(getUnifiedOverdueCount(vehicle));
</script>

<a
	href={`/vehicles/${id}`}
	class="flex flex-1 flex-col gap-3 p-4 rounded-md shadow-sm min-h-[110px] no-underline transition-[filter] duration-100 ease-out-expo bg-brand-500 text-ink-50 hover:brightness-[0.75]"
>
	<div class="flex items-start justify-between">
		<VehicleColorIndicator color={vehicle.color} />
		{#if overdue}
			<Badge variant="warning">
				<Wrench size={14} />
				{overdue}
			</Badge>
		{/if}
	</div>
	<div class="flex flex-col">
		<span class="font-semibold text-always-light">{name}</span>
		<span class="text-sm text-always-light/60">
			{formatMileage(estimatedMileage, distanceUnit)}
			&bull;
			{formatMileage(milesPerYear, distanceUnit)}/yr
		</span>
	</div>
</a>
