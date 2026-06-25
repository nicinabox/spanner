<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://rsms.me"/>
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
	<link rel="icon" type="image/png" href={favicon} />
	{import.meta.env.HEAD_INJECTIONS}
</svelte:head>

{@render children()}
