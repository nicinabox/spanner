<script lang="ts">
	import { pageTitle } from '$lib/utils/site';
	import { PageLayout } from '$lib';
	import Markdown from '$lib/components/Markdown.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{pageTitle(data.data.title as string)}</title>
</svelte:head>

<PageLayout>
	<div class="mx-auto py-12 prose dark:prose-invert">
		<Markdown src={data.content} linkHeadings />
	</div>
</PageLayout>
