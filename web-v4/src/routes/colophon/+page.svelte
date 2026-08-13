<script lang="ts">
	import sanitizeHtml from 'sanitize-html';
	import { marked } from 'marked';
	import { pageTitle } from '$lib/utils/site';
	import src from './page.md?raw';
	import { PageLayout } from '$lib';

	const html = sanitizeHtml(marked(src, { async: false }));
</script>

<svelte:head>
	<title>{pageTitle('Colophon')}</title>
</svelte:head>

<PageLayout>
	<div class="mx-auto py-12 prose dark:prose-invert">
		{@html html}
	</div>
</PageLayout>
