<script lang="ts">
	import '../app.css';
	import { version } from '$app/env';
	import Badge from '$lib/components/common/Badge.svelte';
	import { getCookieData } from '$lib/utils/cookies';
	import { initUmami, trackPageView } from '$lib/umami';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		initUmami();

		const prefs = getCookieData('prefs');
		const theme = prefs?.theme;
		if (theme === 'light' || theme === 'dark') {
			document.documentElement.dataset.theme = theme;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.documentElement.dataset.theme = 'dark';
		}
	});

	afterNavigate(() => {
		trackPageView(page.route.id);
	});
</script>

<div class="min-h-screen flex flex-col">
	{@render children()}

	<footer
		class="flex items-center justify-between text-sm py-4 px-(--main-padding) mt-auto"
		style="padding-bottom: calc(1rem + env(safe-area-inset-bottom))"
	>
		<a href="/legal">Legal</a>
		<Badge>{version}</Badge>
	</footer>
</div>
