<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Vehicle } from '$lib/data/vehicles';
	import { getOverdueRemindersCount } from '$lib/utils/reminders';
	import { pluralize } from '$lib/utils/text';
	import { formatMileage } from '$lib/utils/vehicle';

	const vehicle: Vehicle = $props();
	const { id, name, milesPerYear, estimatedMileage, distanceUnit } = vehicle;

	let overdueRemindersCount = getOverdueRemindersCount(vehicle);
</script>

<a
	href={resolve(`/vehicles/${id}`)}
	class="min-h-[110px] flex-1 rounded-md bg-card p-4 shadow-sm hover:bg-muted"
>
	<h2 class="font-medium">{name}</h2>

	<span class="text-sm text-muted-foreground">
		<span>{formatMileage(estimatedMileage, distanceUnit)}</span>
		&bull;
		<span>{formatMileage(milesPerYear, distanceUnit)}/yr</span>
	</span>

	{#if overdueRemindersCount}
		<span class="badge badge-sm badge-warning mt-2 block">
			{pluralize(overdueRemindersCount, 'overdue reminder', 'overdue reminders')}
		</span>
	{/if}
</a>
