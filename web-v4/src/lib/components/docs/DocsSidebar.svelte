<script lang="ts">
	import { page } from '$app/state';
	import type { DocsGroup, DocsTree } from '$lib/server/content';

	interface Props {
		tree: DocsTree;
		class?: string;
	}

	let { tree, class: className = '' }: Props = $props();

	const currentSlug = $derived(page.params.slug ?? '');

	let flatGroups = $derived([
		{ slug: '', title: 'Documentation', pages: tree.root },
		...tree.groups,
	]);

	const isActive = (slug: string): boolean => slug === currentSlug;
</script>

{#snippet renderGroup(group: DocsGroup)}
	<div class="group/docs mb-10">
		<span class="font-semibold text-xl">
			{group.title}
		</span>
		<ul class="list-none p-0 m-0 mt-2 space-y-2">
			{#each group.pages as p (p.slug)}
				<li>
					<a
						href={p.slug ? `/docs/${p.slug}` : `/docs/${group.slug}`}
						aria-current={isActive(p.slug) ? 'page' : undefined}
						class={[
							'block hover:underline text-inherit',
							'aria-current-page:font-bold aria-current-page:underline aria-current-page:text-brand-500',
						]}
					>
						{#if group.slug === p.slug}
							Overview
						{:else}
							{p.title}
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/snippet}

<nav aria-label="Docs" class={className}>
	{#each flatGroups as group (group.slug)}
		{@render renderGroup(group)}
	{/each}
</nav>
