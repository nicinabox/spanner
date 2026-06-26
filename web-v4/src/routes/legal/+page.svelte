<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Legal — Spanner</title>
</svelte:head>

<div class="mx-auto px-(--main-padding) py-12 prose dark:prose-invert">
	{@html data.html}
</div>
