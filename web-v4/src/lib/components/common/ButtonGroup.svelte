<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		children?: Snippet;
		divider?: boolean;
		class?: ClassValue;
		[key: string]: unknown;
	};

	let { children, divider = true, class: className, ...rest }: Props = $props();
</script>

<div
	class="button-group inline-flex items-center {className}"
	style={divider ? undefined : '--divider-color: transparent'}
	{...rest}
>
	{@render children?.()}
</div>

<style>
	:global(.button-group > :where(button, a)) {
		position: relative;
	}

	:global(.button-group > :where(button, a):first-of-type:not(:last-of-type)) {
		border-top-right-radius: 0 !important;
		border-bottom-right-radius: 0 !important;
		border-right: none !important;
	}

	:global(.button-group > :where(button, a):last-of-type:not(:first-of-type)) {
		border-top-left-radius: 0 !important;
		border-bottom-left-radius: 0 !important;
		border-left: none !important;
	}

	:global(.button-group > :where(button, a):not(:first-of-type):not(:last-of-type)) {
		border-radius: 0 !important;
		border-left: none !important;
		border-right: none !important;
	}

	:global(.button-group > :where(button, a):not(:last-of-type)::after) {
		content: '';
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 1px;
		background-color: var(--divider-color, currentColor);
		opacity: 0.3;
		pointer-events: none;
	}
</style>
