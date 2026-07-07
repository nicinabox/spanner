<script lang="ts">
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';
	import UnifiedTasks from '$lib/components/schedules/UnifiedTasks.svelte';

	let { data }: PageProps = $props();
	let vehicle = $derived(data.vehicle);
</script>

<svelte:head>
	<title>{pageTitle('Reminders', vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout {vehicle} activeTab="tasks">
	<div class="max-w-2xl mx-auto">
		<UnifiedTasks
			reminders={data.reminders}
			schedules={data.schedules}
			classifications={data.classifications}
			presetGroups={data.presetGroups}
			{vehicle}
		/>
	</div>
</VehiclePageLayout>
