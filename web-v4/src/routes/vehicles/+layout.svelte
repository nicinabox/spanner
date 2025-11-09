<script lang="ts">
	import AppBar from '$lib/components/AppBar.svelte';
	import Main from '$lib/components/Main.svelte';
	import type { LayoutProps } from './$types';
	let { children, data }: LayoutProps = $props();
</script>

<AppBar session={data.session} />

<Main>
	{@render children()}
</Main>
