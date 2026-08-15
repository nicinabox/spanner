<script lang="ts">
	import { pageTitle } from '$lib/utils/site';
	import { page } from '$app/state';
	import { AppBar } from '$lib';
	import DocsSidebar from '$lib/components/docs/DocsSidebar.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import { Menu } from 'lucide-svelte';

	let { data } = $props();
	const session = $derived(page.data.session);

	let mobileMenuOpen = $state(false);
	let lastSlug = $state(page.params.slug ?? '');
	$effect(() => {
		const currentSlug = page.params.slug ?? '';
		if (currentSlug !== lastSlug) {
			mobileMenuOpen = false;
			lastSlug = currentSlug;
		}
	});

	let pages = $derived(
		data.tree.groups
			.find((g) => g.slug === page.params.slug)
			?.pages.filter((p) => p.slug !== page.params.slug) ?? [],
	);

	let breadcrumb = $derived.by(() => {
		const segments = (page.params.slug ?? '').split('/').filter(Boolean);
		const trail: { slug: string; title: string }[] = [{ slug: '', title: 'Documentation' }];
		let accumulated = '';
		for (let i = 0; i < segments.length - 1; i++) {
			const seg = segments[i];
			accumulated = accumulated ? `${accumulated}/${seg}` : seg;
			const group = data.tree.groups.find((g) => g.slug === seg);
			const page_ = group?.pages.find((p) => p.slug === accumulated);
			if (page_) {
				trail.push({ slug: page_.slug, title: page_.title });
			} else if (group) {
				trail.push({ slug: group.slug, title: group.title });
			}
		}
		return trail;
	});
</script>

<svelte:head>
	<title>{pageTitle(data.data.title as string)}</title>
	<meta name="description" content={data.excerpt} />
</svelte:head>

<AppBar {session} />

<div class="grid grid-cols-1">
	<aside
		class="fixed left-0 top-(--appbar-height) z-30 hidden lg:block lg:h-[calc(100dvh-var(--appbar-height))] lg:w-72 lg:overflow-y-auto lg:pt-12 lg:border-r lg:border-brand-200 bg-brand-100 dark:bg-ink-50 px-8"
	>
		<DocsSidebar tree={data.tree} />
	</aside>

	<div class="px-(--main-padding) lg:px-12 py-12 min-w-0 lg:ml-72">
		<div class="lg:hidden mb-6">
			<details
				class="group/docs-mobile border border-brand-200 bg-brand-100 rounded"
				bind:open={mobileMenuOpen}
			>
				<summary
					class="cursor-pointer list-none px-3 h-10 items-center flex font-medium select-none marker:hidden [&::-webkit-details-marker]:hidden"
				>
					<span class="inline-flex items-center gap-2">
						<Menu />
						Menu
					</span>
				</summary>
				<div class="px-4 pt-4">
					<DocsSidebar tree={data.tree} />
				</div>
			</details>
		</div>
		<article class="prose dark:prose-invert max-w-3xl min-w-0">
			{#if page.params.slug}
				<nav aria-label="Breadcrumb" class="not-prose text-sm text-ink-500 mb-4">
					<ol class="flex flex-wrap items-center gap-1">
						{#each breadcrumb as crumb, i (crumb.slug)}
							<li class="flex items-center gap-1">
								<a href={crumb.slug ? `/docs/${crumb.slug}` : '/docs'} class="hover:underline">
									{crumb.title}
								</a>
								{#if i < breadcrumb.length - 1}
									<span aria-hidden="true">/</span>
								{/if}
							</li>
						{/each}
					</ol>
				</nav>
			{/if}
			<h1>{data.data.title}</h1>
			<Markdown src={data.content} linkHeadings />

			{#if data.data.auto_index}
				<Markdown
					src={`
## Pages
${pages
	.map((p) => {
		return [`- [${p.title}](${p.slug})`, p.excerpt].join(' - ');
	})
	.join('\n')}
`}
				/>
			{/if}
		</article>
	</div>
</div>
