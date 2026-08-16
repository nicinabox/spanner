<script lang="ts">
	import '../app.css';
	import { getCookieData } from '$lib/utils/cookies';
	import { initUmami, trackPageView, trackingUrl } from '$lib/umami';
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
		const url = trackingUrl(page.route.id, page.url.pathname);
		if (url) trackPageView(url);
	});
</script>

{@render children()}
