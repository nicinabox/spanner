<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Vehicle } from '$lib/data/vehicles';
	import { getOverdueRemindersCount } from '$lib/utils/reminders';
	import { pluralize } from '$lib/utils/text';
	import { formatMileage } from '$lib/utils/vehicle';
	import { Wrench } from 'lucide-svelte';

	const vehicle: Vehicle = $props();
	const { id, name, milesPerYear, estimatedMileage, distanceUnit } = vehicle;

	let overdueRemindersCount = getOverdueRemindersCount(vehicle);
</script>

<a
	href={resolve(`/vehicles/${id}`)}
	class="min-h-[110px] flex-1 rounded-md bg-primary p-4 text-primary-foreground shadow-sm hover:brightness-75"
>
	<h2 class="font-medium">{name}</h2>

	<span class="text-sm text-primary-foreground/60">
		<span>{formatMileage(estimatedMileage, distanceUnit)}</span>
		&bull;
		<span>{formatMileage(milesPerYear, distanceUnit)}/yr</span>
	</span>

	{#if overdueRemindersCount}
		<span class="badge badge-sm mt-2 inline-flex items-center gap-2 text-sm text-amber-500">
			<Wrench size={14} />
			{pluralize(overdueRemindersCount, 'overdue reminder', 'overdue reminders')}
		</span>
	{/if}
</a>
