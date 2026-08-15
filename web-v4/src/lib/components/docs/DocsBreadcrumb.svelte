<script lang="ts">
	import { page } from '$app/state';
	import type { DocsTree } from '$lib/server/content';

	interface Props {
		tree: DocsTree;
	}

	let { tree }: Props = $props();

	let trail = $derived.by(() => {
		const all = [...tree.root, ...tree.groups.flatMap((g) => g.pages)];
		const crumbs: { slug: string; title: string }[] = [{ slug: '', title: 'Documentation' }];
		const segments = (page.params.slug ?? '').split('/').filter(Boolean);
		for (let i = 0; i < segments.length - 1; i++) {
			const segment = segments[i];
			const slug = segments.slice(0, i + 1).join('/');
			const match = all.find((p) => p.slug === slug);
			const title = match?.title ?? tree.groups.find((g) => g.slug === segment)?.title ?? segment;
			crumbs.push({ slug, title });
		}
		return crumbs;
	});
</script>

{#if page.params.slug}
	<nav aria-label="Breadcrumb" class="not-prose text-sm text-ink-500 mb-4">
		<ol class="flex flex-wrap items-center gap-1">
			{#each trail as crumb, i (crumb.slug)}
				<li class="flex items-center gap-1">
					<a href={crumb.slug ? `/docs/${crumb.slug}` : '/docs'} class="hover:underline">
						{crumb.title}
					</a>
					{#if i < trail.length - 1}
						<span aria-hidden="true">/</span>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}
