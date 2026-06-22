<script lang="ts">
	import { Wrench } from 'lucide-svelte';
	import Badge from '$lib/components/common/Badge.svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { getOverdueRemindersCount } from '$lib/utils/reminders';
	import { formatMileage } from '$lib/utils/vehicle';
	import { getColorPalette } from '$lib/utils/colors';

	interface Props {
		vehicle: Vehicle;
	}

	let { vehicle }: Props = $props();

	let { id, name, milesPerYear, estimatedMileage, distanceUnit } = $derived(vehicle);

	let overdue = $derived(getOverdueRemindersCount(vehicle));

	let palette = $derived(getColorPalette(vehicle.color ?? '#cccccc'));
	let colorBg = $derived(`linear-gradient(0deg, ${palette[600]} 50%, ${vehicle.color ?? '#cccccc'} 50%)`);
</script>

<a href={`/vehicles/${id}`} class="vehicle-link">
	<div class="header">
		<div class="color-dot" style="background: {colorBg}; border-color: {palette[400]};"></div>
		{#if overdue}
			<Badge variant="warning">
				<Wrench size={14} />
				{overdue}
			</Badge>
		{/if}
	</div>
	<div class="body">
		<span class="name">{name}</span>
		<span class="meta">
			{formatMileage(estimatedMileage, distanceUnit)}
			&bull;
			{formatMileage(milesPerYear, distanceUnit)}/yr
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
		background-color: var(--color-brand);
		color: var(--color-ink-inverted);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
		min-height: 110px;
		text-decoration: none;
		transition: filter var(--duration-fast) var(--ease-out-expo);
	}

	.vehicle-link:hover {
		filter: brightness(0.75);
	}

	.header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.color-dot {
		width: var(--space-7);
		height: var(--space-7);
		border-radius: var(--radius-full);
		border: 2px solid;
		flex-shrink: 0;
	}

	.body {
		display: flex;
		flex-direction: column;
	}

	.name {
		font-weight: var(--weight-medium);
	}

	.meta {
		font-size: var(--text-sm);
		color: color-mix(in oklch, var(--color-ink-inverted), transparent 40%);
	}
</style>
