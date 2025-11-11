<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import AppBar from '$lib/components/AppBar.svelte';
	import type { LayoutProps } from './$types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Main from '$lib/components/Main.svelte';

	let { data, children }: LayoutProps = $props();

	const view = $derived(page.url.searchParams.get('view') ?? 'history');
	const vehiclePath = `/vehicles/${data.vehicle.id}`;
</script>

<AppBar
	class="grid-cols-2 [grid-template-areas:'start_end''center_center'] max-sm:grid max-sm:gap-2"
>
	{#snippet start()}
		<div class="flex items-center gap-4">
			<a href={resolve('/vehicles')} class="btn btn-sm btn-neutral">
				<ArrowLeft size={16} /> Vehicles</a
			>
			<a
				href={resolve(`/vehicles/${data.vehicle.id}/edit`)}
				class="text-sm font-bold whitespace-nowrap"
			>
				{data.vehicle.name}
			</a>
		</div>
	{/snippet}
	{#snippet center()}
		<div class="join flex flex-1">
			{#each ['history', 'reminders', 'notes'] as tab (tab)}
				<a
					class="btn join-item flex-1 capitalize btn-sm"
					class:btn-active={view === tab && page.url.pathname === vehiclePath}
					href={resolve(`/vehicles/${data.vehicle.id}?view=${tab}`)}
				>
					{tab}
				</a>
			{/each}
		</div>
	{/snippet}
</AppBar>

<Main>
	{@render children()}
</Main>
