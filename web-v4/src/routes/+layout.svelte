<script lang="ts">
	import '@fontsource/lato/300.css';
	import '@fontsource/lato/400.css';
	import '@fontsource/lato/700.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
	{import.meta.env.HEAD_INJECTIONS}
</svelte:head>

{@render children()}
