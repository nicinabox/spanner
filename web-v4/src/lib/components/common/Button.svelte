<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'tertiary' | 'neutral';
	type Size = 'sm' | 'md' | 'lg';
	type Radius = 'pill';
	type Theme = 'light' | 'dark';

	type Props = {
		variant?: Variant;
		radius?: Radius;
		size?: Size;
		theme?: Theme;
		block?: boolean;
		icon?: boolean;
		href?: string;
		type?: 'button' | 'submit' | 'reset' | null;
		disabled?: boolean;
		class?: string;
		children: Snippet;
		[key: string]: unknown;
	};

	let {
		variant = 'primary',
		size = 'md',
		radius,
		theme,
		block = false,
		icon = false,
		href,
		type = 'button',
		disabled,
		class: className,
		children,
		...rest
	}: Props = $props();

	let classes = $derived(
		['btn', variant, size, block && 'full-width', icon && 'icon-only', radius, className]
			.filter(Boolean)
			.join(' ')
	);

	let attrs = $derived(theme ? { 'data-theme': theme, ...rest } : rest);
</script>

{#if href}
	<a {href} class={classes} aria-disabled={disabled || undefined} {...attrs}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} class={classes} {...attrs}>
		{@render children()}
	</button>
{/if}
