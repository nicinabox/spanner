<script lang="ts">
	import { Button } from '$lib';
	import Card from '$lib/components/common/Card.svelte';
	import PageLayout from '$lib/components/common/PageLayout.svelte';
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<PageLayout>
	{#snippet appbarStart()}
		<Button href="/vehicles" color="neutral" theme="dark">
			<ArrowLeft size={16} /> Vehicles
		</Button>
	{/snippet}

	<div class="max-w-xl mx-auto">
		<Card>
			<h1>New Vehicle</h1>
			<VehicleForm errors={form?.errors} />
		</Card>
	</div>
</PageLayout>
