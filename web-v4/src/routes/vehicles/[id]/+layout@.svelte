<script lang="ts">
	import { ArrowLeft, PlusIcon } from 'lucide-svelte';
	import AppBar from '$lib/components/AppBar.svelte';
	import type { LayoutProps } from './$types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Main from '$lib/components/Main.svelte';
	import { parameterize } from '$lib/utils/text';
	import DropdownButton from '$lib/components/DropdownButton.svelte';

	let { data, children }: LayoutProps = $props();
	let { backAction, primaryAction, tabs } = $derived(page.data.appBar);

	const view = $derived(page.url.searchParams.get('view') ?? parameterize(tabs?.[0]?.text ?? ''));
</script>

<AppBar
	class="grid-cols-2 [grid-template-areas:'start_end''center_center'] max-sm:grid max-sm:gap-2"
>
	{#snippet start()}
		<div class="flex items-center gap-2">
			{#if backAction}
				<a href={resolve(backAction.href)} class="btn btn-sm btn-neutral">
					<ArrowLeft size={16} /> {backAction.text}</a
				>
			{/if}
			<DropdownButton
				label={data.vehicle.name}
				class="font-bold whitespace-nowrap [&_summary]:text-sm [&_summary]:btn-ghost [&_summary]:btn-sm"
			>
				<li role="menuitem">
					<a href={resolve(`/vehicles/${data.vehicle.id}/edit`)}> Edit</a>
				</li>
			</DropdownButton>
		</div>
	{/snippet}
	{#snippet center()}
		<div class="flex flex-1 gap-2">
			{#each tabs as link, i (i)}
				<a
					class={[
						'btn flex-1 rounded-full whitespace-nowrap capitalize btn-sm',
						view === parameterize(link.text) ? 'btn-primary' : 'btn-ghost'
					]}
					href={resolve(link.href)}
				>
					{link.text}
				</a>
			{/each}
		</div>
	{/snippet}
	{#snippet end()}
		{#if primaryAction}
			<a class="btn ml-auto btn-sm btn-primary" href={resolve(primaryAction.href)}>
				<PlusIcon size={16} />
				{primaryAction.text}
			</a>
		{/if}
	{/snippet}
</AppBar>

<Main>
	{@render children()}
</Main>
