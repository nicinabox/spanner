<script lang="ts">
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';
	import TasksView from './TasksView.svelte';

	let { data }: PageProps = $props();
	let vehicle = $derived(data.vehicle);
</script>

<svelte:head>
	<title>{pageTitle('Reminders', vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout {vehicle} activeTab="schedules">
	<TasksView
		schedules={data.schedules}
		classifications={data.classifications}
		reminders={data.reminders}
		{vehicle}
	/>
</VehiclePageLayout>
