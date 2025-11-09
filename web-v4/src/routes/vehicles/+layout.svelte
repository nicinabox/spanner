<script lang="ts">
	import AppBar from '$lib/components/AppBar.svelte';
	import type { LayoutProps } from './$types';
	let { children, data }: LayoutProps = $props();
</script>

<AppBar session={data.session} />

<main class="container mx-auto my-8">
	{@render children()}
</main>
