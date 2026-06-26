<script lang="ts">
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{pageTitle('Legal')}</title>
</svelte:head>

<div class="mx-auto px-(--main-padding) py-12 prose dark:prose-invert">
	{@html data.html}
</div>
