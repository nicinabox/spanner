<script lang="ts">
	import { marked } from 'marked';
	import insane from 'insane';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import Stat from '$lib/components/Stat.svelte';

	let { data }: PageProps = $props();

	const view = $derived(page.url.searchParams.get('view') ?? 'history');
</script>

<div>
	<header class="my-8">
		<div class="flex">
			<Stat title="Estimated Mileage" value={data.vehicle.estimatedMileage} />
			<Stat title="Mileage Rate" value={data.vehicle.milesPerYear} />
			<Stat title="Since" value={new Date(data.vehicle.createdAt).getFullYear()} />
			<Stat title="VIN" value={data.vehicle.vin} />
		</div>
	</header>

	{#if view === 'history'}
		<section class="my-8" id="history">
			<h2 class="h2">History</h2>
			<ul>
				{#each data.history as entry (entry.id)}
					<li>{entry.date}: {entry.notes}</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if view === 'reminders'}
		<section class="my-8" id="reminders">
			<h2 class="h2">Reminders</h2>
			<ul>
				{#each data.vehicle.reminders as reminder (reminder.id)}
					<li>{reminder.notes}</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if view === 'notes'}
		<section class="my-8" id="notes">
			<h2 class="h2">Notes</h2>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div>{@html insane(marked(data.vehicle.notes, { async: false }))}</div>
		</section>
	{/if}
</div>
