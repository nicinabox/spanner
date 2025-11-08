<script lang="ts">
	import { marked } from 'marked';
	import insane from 'insane';
	import type { PageProps } from './$types';
	import Stat from '$lib/components/Stat.svelte';

	let { data }: PageProps = $props();
</script>

<div>
	<h1 class="h1">{data.vehicle.name}</h1>

	<header class="my-8">
		<div class="stats shadow">
			<Stat title="Estimated Mileage" value={data.vehicle.estimatedMileage} />
			<Stat title="Mileage Rate" value={data.vehicle.milesPerYear} />
			<Stat title="Since" value={new Date(data.vehicle.createdAt).getFullYear()} />
			<Stat title="VIN" value={data.vehicle.vin} />
		</div>
	</header>

	<section class="my-8">
		<h2 class="h2">History</h2>
		<ul>
			{#each data.history as entry (entry.id)}
				<li>{entry.date}: {entry.notes}</li>
			{/each}
		</ul>
	</section>

	<section class="my-8">
		<h2 class="h2">Reminders</h2>
		<ul>
			{#each data.vehicle.reminders as reminder (reminder.id)}
				<li>{reminder.notes}</li>
			{/each}
		</ul>
	</section>

	<section class="my-8">
		<h2 class="h2">Notes</h2>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div>{@html insane(marked(data.vehicle.notes, { async: false }))}</div>
	</section>
</div>
