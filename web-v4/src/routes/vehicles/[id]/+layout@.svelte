<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import AppBar from '$lib/components/AppBar.svelte';
	import type { LayoutProps } from './$types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { data, children }: LayoutProps = $props();

	const view = $derived(page.url.searchParams.get('view') ?? 'history');
</script>

<AppBar>
	{#snippet start()}
		<div class="flex items-center gap-4">
			<a href={resolve('/vehicles')} class="btn"> <ArrowLeft size={16} /> Vehicles</a>
			<span class="font-medium">{data.vehicle.name}</span>
		</div>
	{/snippet}
	{#snippet center()}
		<div class="join flex">
			{#each ['history', 'reminders', 'notes'] as tab (tab)}
				<a class="btn join-item capitalize" class:btn-active={view === tab} href={`?view=${tab}`}>
					{tab}
				</a>
			{/each}
		</div>
	{/snippet}
</AppBar>

<main class="container mx-auto my-8">
	{@render children()}
</main>
