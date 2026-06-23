<script lang="ts">
	import { ChevronRight, PlusIcon } from 'lucide-svelte';
	import VehicleLink from '$lib/components/vehicles/VehicleLink.svelte';
	import Stat from '$lib/components/common/Stat.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import VehicleSortMenu from '$lib/components/vehicles/VehicleSortMenu.svelte';
	import { sortVehiclesBy } from '$lib/utils/sortable';
	import { formatMileage } from '$lib/utils/vehicle';
	import type { DistanceUnit, Sortable, Vehicle } from '$lib/data/vehicles';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: PageProps = $props();

	let active = $derived(data.vehicles.filter((v) => !v.retired));
	let retired = $derived(
		sortVehiclesBy(
			data.vehicles.filter((v) => v.retired),
			['created_at', 'desc']
		)
	);

	let showRetired = $state(false);

	let vehiclesByDistanceUnit = $derived(
		Object.entries(Object.groupBy(active, (v) => v.distanceUnit)) as [DistanceUnit, Vehicle[]][]
	);

	let user = $derived(form?.user ?? data.user);
	let vehiclesSortOrder = $state(['created_at', 'asc'] as Sortable);

	$effect(() => {
		vehiclesSortOrder = user.preferences.vehiclesSortOrder;
	});
</script>

<div class="mb-6 flex justify-start gap-12 md:gap-16 overflow-auto pointer-coarse:no-scrollbar">
	<Stat title="Active vehicles" value={active.length} />

	{#each vehiclesByDistanceUnit as [distanceUnit, vehicles] (distanceUnit)}
		{@const total = vehicles.reduce((acc, v) => acc + (v.milesPerYear ?? 0), 0)}
		<Stat title={`Total ${distanceUnit} per year`} value={formatMileage(total, distanceUnit)} />
	{/each}
</div>

<header class="vehicles-header">
	<h1 class="text-xl">Vehicles</h1>

	<Button href="/vehicles/new" variant="tertiary" class="new-btn">
		<PlusIcon size={16} /> New
	</Button>

	<form method="POST" action="?/updateUserPreferences" use:enhance class="sort-form">
		<input type="hidden" value={vehiclesSortOrder[0]} name="strategy" />
		<input type="hidden" value={vehiclesSortOrder[1]} name="order" />
		<VehicleSortMenu
			sortable={vehiclesSortOrder}
			onSelect={(value) => {
				vehiclesSortOrder = value;

				const form = document.querySelector(
					'form[action$="updateUserPreferences"]'
				) as HTMLFormElement | null;
				if (form) {
					const strategyInput = form.querySelector(
						'input[name=strategy]'
					) as HTMLInputElement | null;
					const orderInput = form.querySelector('input[name=order]') as HTMLInputElement | null;
					if (strategyInput) strategyInput.value = value[0];
					if (orderInput) orderInput.value = value[1];
					form.requestSubmit();
				}
			}}
		/>
	</form>
</header>

<section>
	<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-0">
		{#each sortVehiclesBy(active, vehiclesSortOrder) as v (v.id)}
			<li class="flex">
				<VehicleLink vehicle={v} />
			</li>
		{/each}
	</ul>
</section>

<section class="mt-8">
	<Button
		aria-pressed={showRetired}
		class="my-4"
		variant="secondary"
		onclick={() => (showRetired = !showRetired)}
	>
		{showRetired ? 'Hide' : 'Show'} retired
		<ChevronRight size={16} class={showRetired ? 'rotate-90' : ''} />
	</Button>

	<div>
		<ul
			class:hidden={!showRetired}
			class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-0"
		>
			{#each retired as v (v.id)}
				<li class="flex">
					<VehicleLink vehicle={v} />
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.vehicles-header {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-areas:
			'title new'
			'sort sort';
		gap: 0.5rem;
		align-items: center;
		margin-bottom: 1rem;
	}

	.vehicles-header :global(h1) {
		grid-area: title;
	}

	:global(.new-btn) {
		grid-area: new;
		justify-self: end;
	}

	.sort-form {
		grid-area: sort;
		display: block;
	}

	.sort-form :global(.menu) {
		display: block;
	}

	@media (max-width: 639px) {
		.sort-form :global([data-part='trigger']) {
			width: 100%;
			position: relative;
			justify-content: center;
		}

		.sort-form :global([data-part='trigger']) :global([data-part='indicator']) {
			position: absolute;
			right: var(--btn-inline-padding, 0.75rem);
		}
	}

	@media (min-width: 640px) {
		.vehicles-header {
			grid-template-columns: auto 1fr auto;
			grid-template-areas: 'title new sort';
		}

		.sort-form {
			justify-self: end;
		}
	}
</style>
