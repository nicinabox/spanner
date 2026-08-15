<script lang="ts">
	import { page } from '$app/state';
	import type { DocsTree } from '$lib/server/content';

	interface Props {
		tree: DocsTree;
		class?: string;
	}

	let { tree, class: className = '' }: Props = $props();

	const currentSlug = $derived(page.params.slug ?? '');

	const isActive = (slug: string): boolean => slug === currentSlug;
</script>

<nav aria-label="Docs" class={className}>
	{#if tree.root.length > 0}
		<ul class="list-none p-0 m-0 mb-10 space-y-2">
			{#each tree.root as p (p.slug)}
				<li>
					<a
						href={p.slug ? `/docs/${p.slug}` : '/docs'}
						aria-current={isActive(p.slug) ? 'page' : undefined}
						class={[
							'block hover:underline text-inherit',
							'aria-current-page:font-bold aria-current-page:underline aria-current-page:text-brand-500',
						]}
					>
						{p.title}
					</a>
				</li>
			{/each}
		</ul>
	{/if}

	{#each tree.groups as group (group.slug)}
		<div class="group/docs mb-10">
			<span class="font-semibold text-xl">{group.title}</span>
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
							{p.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
