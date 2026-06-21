<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'tertiary' | 'neutral';
	type Size = 'sm' | 'md' | 'lg';
	type Radius = 'pill';

	type Props = {
		variant?: Variant;
		radius?: Radius;
		size?: Size;
		block?: boolean;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		children: Snippet;
		[key: string]: unknown;
	};

	let {
		variant = 'primary',
		size = 'md',
		radius,
		block = false,
		href,
		type = 'button',
		disabled,
		class: className,
		children,
		...rest
	}: Props = $props();

	let classes = $derived(
		['btn', variant, size, block && 'block', radius, className].filter(Boolean).join(' ')
	);
</script>

{#if href}
	<a {href} class={classes} aria-disabled={disabled || undefined} {...rest}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} class={classes} {...rest}>
		{@render children()}
	</button>
{/if}
