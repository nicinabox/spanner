<script lang="ts">
	import sanitizeHtml from 'sanitize-html';
	import { marked } from 'marked';
	import { pageTitle } from '$lib/utils/site';
	import { PUBLIC_CONTACT_EMAIL } from '$app/env/public';
	import src from './page.md?raw';
	import { PageLayout } from '$lib';

	const email = PUBLIC_CONTACT_EMAIL || 'the operator of this instance';
	const html = sanitizeHtml(marked(src.replaceAll('{{CONTACT_EMAIL}}', email), { async: false }));
</script>

<svelte:head>
	<title>{pageTitle('Legal')}</title>
</svelte:head>

<PageLayout>
	<div class="mx-auto py-12 prose dark:prose-invert">
		{@html html}
	</div>
</PageLayout>
