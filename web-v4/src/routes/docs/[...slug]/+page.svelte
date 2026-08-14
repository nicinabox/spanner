<script lang="ts">
	import { pageTitle } from '$lib/utils/site';
	import { PageLayout } from '$lib';
	import DocsSidebar from '$lib/components/docs/DocsSidebar.svelte';
	import Markdown from '$lib/components/Markdown.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{pageTitle(data.data.title as string)}</title>
</svelte:head>

<PageLayout>
	<div class="mx-auto max-w-6xl py-12 grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-8">
		<aside class="lg:sticky lg:top-(--appbar-height) lg:self-start lg:max-h-[calc(100vh-var(--appbar-height))] lg:overflow-y-auto">
			<details class="lg:hidden group/docs-mobile mb-4 border border-ink-200 rounded">
				<summary
					class="cursor-pointer list-none px-3 py-2 font-medium select-none marker:hidden [&::-webkit-details-marker]:hidden"
				>
					<span class="inline-flex items-center gap-2">
						<span class="text-ink-400 text-xs transition-transform group-open/docs-mobile:rotate-90" aria-hidden="true">
							&#x25B8;
						</span>
						Docs navigation
					</span>
				</summary>
				<div class="px-2 pb-2">
					<DocsSidebar tree={data.tree} />
				</div>
			</details>
			<div class="hidden lg:block">
				<DocsSidebar tree={data.tree} />
			</div>
		</aside>
		<article class="prose dark:prose-invert min-w-0">
			<Markdown src={data.content} linkHeadings />
		</article>
	</div>
</PageLayout>
