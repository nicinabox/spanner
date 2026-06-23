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
	let colorBg = $derived(
		`linear-gradient(0deg, ${palette[600]} 50%, ${vehicle.color ?? '#cccccc'} 50%)`
	);
</script>

<a
	href={`/vehicles/${id}`}
	class="flex flex-1 flex-col gap-3 p-4 rounded-md shadow-sm min-h-[110px] no-underline transition-[filter] duration-100 ease-out-expo bg-brand-500 text-ink-50 hover:brightness-[0.75]"
>
	<div class="flex items-start justify-between">
		<div
			class="size-7 rounded-full border-2 shrink-0"
			style="background: {colorBg}; border-color: {palette[400]};"
		></div>
		{#if overdue}
			<Badge variant="warning">
				<Wrench size={14} />
				{overdue}
			</Badge>
		{/if}
	</div>
	<div class="flex flex-col">
		<span class="font-bold text-always-light">{name}</span>
		<span class="text-sm text-always-light/60">
			{formatMileage(estimatedMileage, distanceUnit)}
			&bull;
			{formatMileage(milesPerYear, distanceUnit)}/yr
		</span>
	</div>
</a>
