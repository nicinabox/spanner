<script lang="ts">
	import { page } from '$app/state';
	import Notes from '$lib/views/Notes.svelte';
	import Reminders from '$lib/views/Reminders.svelte';
	import History from '$lib/views/History.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const view = $derived(page.url.searchParams.get('view') ?? 'history');
</script>

<div>
	{#if view === 'history'}
		<section class="my-8" id="history">
			<History vehicle={data.vehicle} history={data.history} />
		</section>
	{/if}

	{#if view === 'reminders'}
		<section class="mx-auto my-8 max-w-[80ch]" id="reminders">
			<Reminders vehicle={data.vehicle} />
		</section>
	{/if}

	{#if view === 'notes'}
		<section class="mx-auto my-8 max-w-[80ch]" id="notes">
			<Notes vehicle={data.vehicle} />
		</section>
	{/if}
</div>
