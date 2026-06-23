<script lang="ts">
	import { Button } from '$lib';
	import PageLayout from '$lib/components/common/PageLayout.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import Menu from '$lib/components/common/Menu.svelte';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
</script>

<PageLayout>
	{#snippet header()}
		<div class="flex gap-2">
			<Button href="/vehicles" variant="neutral" theme="dark">
				<ArrowLeft size={16} /> Vehicles
			</Button>

			<Menu
				trigger={vehicle.name}
				variant="tertiary"
				theme="dark"
				items={[
					{ value: 'edit', label: 'Edit', href: `/vehicles/${vehicle.id}/edit` },
					{ value: 'color', label: 'Change Color' },
					{ value: 'retire', label: 'Retire' }
				]}
			></Menu>
		</div>
	{/snippet}

	<div class="max-w-xl mx-auto">
		<div class="flex items-start justify-between mb-6">
			<div>
				<h1 class="text-xl">{vehicle.name}</h1>
				<p class="text-sm text-ink-500">
					{vehicle.estimatedMileage}
					{vehicle.distanceUnit} &bull; {vehicle.milesPerYear}
					{vehicle.distanceUnit}/yr
				</p>
			</div>
			<Button href="/vehicles/{vehicle.id}/edit" variant="tertiary">Edit</Button>
		</div>
	</div>
</PageLayout>
