<script lang="ts">
	import insane from 'insane';
	import { marked } from 'marked';
	import { pageTitle } from '$lib/utils/site';
	import src from './legal.md?raw';

	const html = insane(marked(src, { async: false }));
</script>

<svelte:head>
	<title>{pageTitle('Legal')}</title>
</svelte:head>

<div class="mx-auto px-(--main-padding) py-12 prose dark:prose-invert">
	{@html html}
</div>
