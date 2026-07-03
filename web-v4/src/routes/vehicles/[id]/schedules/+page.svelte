<script lang="ts">
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';
	import ServiceSchedulesView from './ServiceSchedulesView.svelte';

	let { data }: PageProps = $props();
	let vehicle = $derived(data.vehicle);
</script>

<svelte:head>
	<title>{pageTitle('Service Tasks', vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout {vehicle} activeTab="schedules">
	<ServiceSchedulesView
		schedules={data.schedules}
		classifications={data.classifications}
		{vehicle}
	/>
</VehiclePageLayout>
