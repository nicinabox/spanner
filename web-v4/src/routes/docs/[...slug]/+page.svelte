<script lang="ts">
	import { pageTitle } from '$lib/utils/site';
	import { page } from '$app/state';
	import { AppBar } from '$lib';
	import DocsSidebar from '$lib/components/docs/DocsSidebar.svelte';
	import DocsBreadcrumb from '$lib/components/docs/DocsBreadcrumb.svelte';
	import DocsPrevNext from '$lib/components/docs/DocsPrevNext.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import { Menu } from 'lucide-svelte';
	import Heading from '$lib/components/Heading.svelte';

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
</script>

<svelte:head>
	<title>{pageTitle(data.data.title as string, 'Docs')}</title>
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
			<DocsBreadcrumb tree={data.tree} />
			<h1>{data.data.title}</h1>
			<Markdown src={data.content} linkHeadings />

			{#if data.data.auto_index}
				<Heading level={2} link id="pages">Pages</Heading>
				<ul>
					{#each pages as p, i (p)}
						<li>
							<a href={p.slug}>
								{p.title}
							</a>
							{#if p.excerpt}
								- {p.excerpt}
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
			<DocsPrevNext tree={data.tree} />
		</article>
	</div>
</div>
