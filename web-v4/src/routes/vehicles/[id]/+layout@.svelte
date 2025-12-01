<script lang="ts">
	import { ArrowLeft, PlusIcon } from 'lucide-svelte';
	import AppBar from '$lib/components/AppBar.svelte';
	import type { LayoutProps } from './$types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Main from '$lib/components/Main.svelte';
	import { parameterize } from '$lib/utils/text';
	import DropdownMenu from '$lib/components/DropdownMenu.svelte';
	import Button from '$lib/components/ui/Button.svelte';

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
				<Button href={backAction.href} size="sm" variant="neutral">
					<ArrowLeft size={16} />
					{backAction.text}
				</Button>
			{/if}
			<DropdownMenu label={data.vehicle.name} size="sm" variant="ghost">
				<li role="menuitem">
					<a href={resolve(`/vehicles/${data.vehicle.id}/edit`)}>Edit</a>
				</li>
				<li role="menuitem">
					<button>Change color</button>
				</li>
				<li role="menuitem">
					<button>Mark retired</button>
				</li>
				<li role="separator"></li>
				<li role="menuitem">
					<button>Share</button>
				</li>
				<li role="separator"></li>
				<li role="menuitem">
					<button>Import/Export</button>
				</li>
			</DropdownMenu>
		</div>
	{/snippet}
	{#snippet center()}
		<div class="flex flex-1 gap-1">
			{#each tabs as link, i (i)}
				<Button
					aria-selected={view === parameterize(link.text)}
					size="sm"
					class="flex-1 rounded-full whitespace-nowrap capitalize aria-selected:bg-secondary"
					href={resolve(link.href)}
					variant="ghost"
				>
					{link.text}
				</Button>
			{/each}
		</div>
	{/snippet}
	{#snippet end()}
		{#if primaryAction}
			<Button size="sm" class="ml-auto" href={primaryAction.href}>
				<PlusIcon size={16} />
				{primaryAction.text}
			</Button>
		{/if}
	{/snippet}
</AppBar>

<Main>
	{@render children()}
</Main>
