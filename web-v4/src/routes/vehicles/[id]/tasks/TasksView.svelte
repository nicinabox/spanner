<script lang="ts">
	import RemindersSection from '$lib/components/schedules/RemindersSection.svelte';
	import TasksSection from '$lib/components/schedules/TasksSection.svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Reminder } from '$lib/data/reminders';
	import type { Classification } from '$lib/data/classifications';
	import type { Vehicle } from '$lib/data/vehicles';

	let {
		schedules,
		classifications,
		reminders,
		vehicle,
	}: {
		schedules: ServiceSchedule[];
		classifications: Classification[];
		reminders: Reminder[];
		vehicle: Vehicle;
	} = $props();
</script>

<div class="max-w-2xl mx-auto space-y-12">
	<RemindersSection {reminders} {vehicle} />
	<TasksSection {schedules} {classifications} {vehicle} />
</div>
