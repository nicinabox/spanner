<script lang="ts">
	import SegmentedControl from '#lib/components/common/SegmentedControl.svelte';
	import { Sun, Moon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { getCookieData, setCookieData } from '#lib/utils/cookies.ts';
	import { isTheme, nextThemePref, resolveTheme, type Theme, type ThemePref } from '#lib/utils/theme.ts';

	let pref = $state<ThemePref>('auto');
	let systemPrefersDark = $state(false);

	onMount(() => {
		const stored = getCookieData('prefs')?.theme;
		if (isTheme(stored)) pref = stored;

		const query = window.matchMedia('(prefers-color-scheme: dark)');
		systemPrefersDark = query.matches;
		const onChange = (event: MediaQueryListEvent) => (systemPrefersDark = event.matches);
		query.addEventListener('change', onChange);
		return () => query.removeEventListener('change', onChange);
	});

	let resolved: Theme = $derived(resolveTheme(pref, systemPrefersDark));

	function setTheme(current: Theme) {
		const next = nextThemePref(current, systemPrefersDark);
		pref = next;

		if (next === 'auto') {
			document.documentElement.removeAttribute('data-theme');
		} else {
			document.documentElement.setAttribute('data-theme', next);
		}

		const prefs = getCookieData('prefs') ?? {};
		setCookieData('prefs', { ...prefs, theme: next });
	}
</script>

<SegmentedControl
	items={[
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
	]}
	value={resolved}
	onValueChange={(details) => {
		if (details.value && details.value !== resolved) setTheme(resolved);
	}}
>
	{#snippet children(item)}
		{#if item.value === 'light'}
			<Sun size={16} />
		{:else}
			<Moon size={16} />
		{/if}
		<span>{item.label}</span>
	{/snippet}
</SegmentedControl>
