<script lang="ts">
	import { Button, SegmentedControl } from '$lib';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import type { ButtonSize } from '$lib/components/common/Button.svelte';
	import { Sun, Moon, Monitor } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { getCookieData, setCookieData } from '$lib/utils/cookies';

	type Theme = 'light' | 'dark' | 'auto';

	let {
		size,
		variant = 'button',
	}: {
		size?: ButtonSize;
		variant?: 'button' | 'segmented';
	} = $props();

	let theme = $state<Theme>('auto');

	onMount(() => {
		const prefs = getCookieData('prefs');
		if (prefs?.theme) theme = prefs.theme as Theme;
		apply(theme);
	});

	function apply(t: Theme) {
		if (t === 'auto') {
			document.documentElement.removeAttribute('data-theme');
		} else {
			document.documentElement.setAttribute('data-theme', t);
		}
	}

	function setTheme(t: Theme) {
		theme = t;
		apply(t);
		const prefs = getCookieData('prefs') ?? {};
		setCookieData('prefs', { ...prefs, theme });
	}

	function cycle() {
		const next: Record<Theme, Theme> = { light: 'dark', dark: 'auto', auto: 'light' };
		setTheme(next[theme]);
	}

	let tooltipContent = $derived(
		theme === 'light'
			? 'Switch to dark mode'
			: theme === 'dark'
				? 'Switch to auto mode'
				: 'Switch to light mode',
	);
</script>

{#if variant === 'segmented'}
	<SegmentedControl
		items={[
			{ value: 'light', label: 'Light' },
			{ value: 'dark', label: 'Dark' },
			{ value: 'auto', label: 'Auto' },
		]}
		value={theme}
		onValueChange={(details) => {
			if (details.value) setTheme(details.value as Theme);
		}}
	/>
{:else}
	<Tooltip content={tooltipContent} closeOnClick={false}>
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
{/if}
