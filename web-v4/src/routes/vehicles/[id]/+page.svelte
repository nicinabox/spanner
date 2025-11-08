<script lang="ts">
	import { marked } from 'marked';
	import insane from 'insane';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div>
	<h1 class="h1">{data.vehicle.name}</h1>

	<div class="stats">
		<div class="stat">
			<div class="stat-title">Estimated Mileage</div>
			<div class="stat-value">{data.vehicle.estimatedMileage}</div>
		</div>
		<div class="stat">
			<div class="stat-title">Mileage Rate</div>
			<div class="stat-value">{data.vehicle.estimatedMileage}</div>
		</div>
		<div class="stat">
			<div class="stat-title">Since</div>
			<div class="stat-value">{new Date(data.vehicle.createdAt).getFullYear()}</div>
		</div>
		<div class="stat">
			<div class="stat-title">VIN</div>
			<div class="stat-value">{data.vehicle.vin}</div>
		</div>
	</div>

	<h2 class="h2">History</h2>
	<ul>
		{#each data.history as entry (entry.id)}
			<li>{entry.date}: {entry.notes}</li>
		{/each}
	</ul>

	<h2 class="h2">Reminders</h2>
	<ul>
		{#each data.vehicle.reminders as reminder (reminder.id)}
			<li>{reminder.notes}</li>
		{/each}
	</ul>

	<h2 class="h2">Notes</h2>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div>{@html insane(marked(data.vehicle.notes, { async: false }))}</div>
</div>
