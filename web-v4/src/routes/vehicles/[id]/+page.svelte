<script lang="ts">
	import { Button } from '$lib';
	import PageLayout from '$lib/components/common/PageLayout.svelte';
	import Stat from '$lib/components/common/Stat.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import type { PageProps } from './$types';
	import Menu from '$lib/components/common/Menu.svelte';
	import VehicleColorIndicator from '$lib/components/vehicles/VehicleColorIndicator.svelte';

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
				variant="tertiary"
				theme="dark"
				items={[
					{ value: 'edit', label: 'Edit', href: `/vehicles/${vehicle.id}/edit` },
					{ value: 'color', label: 'Change Color' },
					{ value: 'retire', label: 'Retire' }
				]}
			>
				{#snippet trigger()}
					<VehicleColorIndicator color={vehicle.color} size={6} /> {vehicle.name}
				{/snippet}
			</Menu>
		</div>
	{/snippet}

	<div class="max-w-6xl mx-auto">
		<div
			class="mb-6 flex justify-between gap-12 md:gap-16 overflow-auto pointer-coarse:no-scrollbar"
		>
			<Stat
				title="Estimated mileage"
				value={vehicle.estimatedMileage
					? `${vehicle.estimatedMileage.toLocaleString()} ${vehicle.distanceUnit}`
					: null}
			/>
			<Stat
				title="Mileage rate"
				value={vehicle.milesPerYear
					? `${vehicle.milesPerYear.toLocaleString()} ${vehicle.distanceUnit}/yr`
					: null}
			/>
			<Stat title="Since" value={vehicle.createdAt ? intlFormatDateUTC(vehicle.createdAt) : null} />
			<Stat title="VIN" value={vehicle.vin} />
		</div>
	</div>
</PageLayout>
