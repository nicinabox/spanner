<script lang="ts">
	import { Button } from '$lib';
	import Card from '$lib/components/common/Card.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>{pageTitle('New Vehicle')}</title>
</svelte:head>

<PageLayout>
	{#snippet appbarStart()}
		<Button size="sm" href="/vehicles" color="neutral" theme="dark">
			<ArrowLeft size={16} /> Vehicles
		</Button>
	{/snippet}

	<div class="max-w-xl mx-auto">
		<Card variant="outline" bleed>
			<h1>New Vehicle</h1>
			<VehicleForm action="?/createVehicle" errors={form?.errors} />
		</Card>
	</div>
</PageLayout>
