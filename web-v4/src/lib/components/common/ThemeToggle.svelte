<script lang="ts">
	import { Button } from '$lib';
	import { Sun, Moon, Monitor } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark' | 'auto';

	let theme = $state<Theme>('auto');

	onMount(() => {
		const stored = document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$)|^.*$/, '$1') as Theme;
		if (stored) theme = stored;
		apply(theme);
	});

	function apply(t: Theme) {
		if (t === 'auto') {
			document.documentElement.removeAttribute('data-theme');
		} else {
			document.documentElement.setAttribute('data-theme', t);
		}
	}

	function cycle() {
		const next: Record<Theme, Theme> = { light: 'dark', dark: 'auto', auto: 'light' };
		theme = next[theme];
		apply(theme);
		document.cookie = `theme=${theme};path=/;max-age=31536000`;
	}
</script>

<Button variant="tertiary" icon theme="dark" onclick={cycle}>
	{#if theme === 'light'}
		<Sun size={18} />
	{:else if theme === 'dark'}
		<Moon size={18} />
	{:else}
		<Monitor size={18} />
	{/if}
</Button>
