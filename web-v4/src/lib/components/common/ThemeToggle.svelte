<script lang="ts">
	import { Button } from '$lib';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import type { ButtonSize } from '$lib/components/common/Button.svelte';
	import { Sun, Moon, Monitor } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark' | 'auto';

	let { size }: { size?: ButtonSize } = $props();

	let theme = $state<Theme>('auto');

	onMount(() => {
		const stored = document.cookie.replace(
			/(?:(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$)|^.*$/,
			'$1'
		) as Theme;
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

	let tooltipContent = $derived(
		theme === 'light'
			? 'Switch to dark mode'
			: theme === 'dark'
				? 'Switch to auto mode'
				: 'Switch to light mode'
	);
</script>

<Tooltip content={tooltipContent}>
	{#snippet children(props)}
		<Button {...props} variant="ghost" icon theme="dark" {size} onclick={cycle}>
			{#if theme === 'light'}
				<Sun size={18} />
			{:else if theme === 'dark'}
				<Moon size={18} />
			{:else}
				<Monitor size={18} />
			{/if}
		</Button>
	{/snippet}
</Tooltip>
