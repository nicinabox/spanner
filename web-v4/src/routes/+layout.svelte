<script lang="ts">
	import '../app.css';
	import { version } from '$app/env';
	import { PUBLIC_CONTACT_EMAIL } from '$app/env/public';
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
		class="flex flex-wrap items-center justify-end gap-6 text-sm py-4 px-(--main-padding) mt-auto"
		style="padding-bottom: calc(1rem + env(safe-area-inset-bottom))"
	>
		{#if PUBLIC_CONTACT_EMAIL}
			<a href="/legal" class="underline">Legal</a>
			<a href="mailto:{PUBLIC_CONTACT_EMAIL}" class="underline">Help</a>
		{/if}

		<a href="/colophon" class="underline">Colophon</a>

		<span class="text-ink-500">
			Built with 🧡 by <a
				href="https://nicinabox.com"
				target="_blank"
				class="underline text-current">@nicinabox</a
			>
		</span>

		<Badge>{version}</Badge>
	</footer>
</div>
