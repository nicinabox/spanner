<script lang="ts">
	import { page } from '$app/state';
	import type { DocsTree } from '$lib/server/content';

	interface Props {
		tree: DocsTree;
	}

	let { tree }: Props = $props();

	let ordered = $derived.by(() => {
		const all: { slug: string; title: string }[] = [];
		for (const root of tree.root) {
			all.push({ slug: root.slug, title: root.title });
		}
		for (const group of tree.groups) {
			for (const p of group.pages) {
				all.push({ slug: p.slug, title: p.title });
			}
		}
		return all;
	});

	let currentIndex = $derived(ordered.findIndex((p) => p.slug === (page.params.slug ?? '')));

	let prev = $derived(currentIndex > 0 ? ordered[currentIndex - 1] : null);
	let next = $derived(
		currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : null,
	);
</script>

{#if prev || next}
	<nav
		aria-label="Page navigation"
		class="not-prose mt-12 flex justify-between gap-4 border-t border-ink-200 pt-6"
	>
		{#if prev}
			<a
				href={prev.slug ? `/docs/${prev.slug}` : '/docs'}
				class="group flex flex-col gap-1 rounded no-underline"
			>
				<span class="text-sm text-ink-500">Previous</span>
				<span class="font-medium group-hover:underline">{prev.title}</span>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if next}
			<a
				href={next.slug ? `/docs/${next.slug}` : '/docs'}
				class="group flex flex-col gap-1 rounded no-underline text-right"
			>
				<span class="text-sm text-ink-500">Next</span>
				<span class="font-medium group-hover:underline">{next.title}</span>
			</a>
		{/if}
	</nav>
{/if}
