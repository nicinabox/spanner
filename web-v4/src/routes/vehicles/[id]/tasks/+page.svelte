<script lang="ts">
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';
	import RemindersSection from '$lib/components/schedules/RemindersSection.svelte';
	import TasksSection from '$lib/components/schedules/TasksSection.svelte';

	let { data }: PageProps = $props();
	let vehicle = $derived(data.vehicle);
</script>

<svelte:head>
	<title>{pageTitle('Reminders', vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout {vehicle} activeTab="tasks">
	<div class="max-w-2xl mx-auto my-6 space-y-20">
		<RemindersSection reminders={data.reminders} {vehicle} />
		<TasksSection schedules={data.schedules} classifications={data.classifications} {vehicle} />
	</div>
</VehiclePageLayout>
