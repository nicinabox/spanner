<script lang="ts">
		import type { Vehicle } from '$lib/data/vehicles';
	import { getOverdueRemindersCount } from '$lib/utils/reminders';
	import { formatMileage } from '$lib/utils/vehicle';

	interface Props {
		vehicle: Vehicle;
	}

	let { vehicle }: Props = $props();

	let overdue = $derived(getOverdueRemindersCount(vehicle));
</script>

<a href={`/vehicles/${vehicle.id}`} class="vehicle-link surface shadow-sm">
	<div class="flex items-start justify-between">
		<div
			class="vehicle-color"
			style="--color: {vehicle.color ?? '#cccccc'};"
		></div>
		{#if overdue}
			<span class="badge badge-warning">{overdue}</span>
		{/if}
	</div>
	<div class="flex flex-col">
		<span class="font-medium">{vehicle.name}</span>
		<span class="text-sm text-subtle">
			{formatMileage(vehicle.estimatedMileage, vehicle.distanceUnit)}
			&bull;
			{formatMileage(vehicle.milesPerYear, vehicle.distanceUnit)}/yr
		</span>
	</div>
</a>

<style>
	.vehicle-link {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--space-sm);
		padding: var(--space-md);
		border: 1px solid var(--color-ink-lightest);
		border-radius: var(--radius-md);
		min-height: 110px;
		transition: filter var(--duration-fast) var(--ease-out-expo);
	}

	.vehicle-link:hover {
		filter: brightness(0.97);
	}

	.vehicle-color {
		width: var(--space-6);
		height: var(--space-6);
		border-radius: var(--radius-full);
		border: 2px solid var(--color-ink-lightest);
		background: var(--color);
	}
</style>