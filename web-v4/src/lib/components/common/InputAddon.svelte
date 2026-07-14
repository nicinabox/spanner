<script lang="ts">
	import { cn } from 'tailwind-variants';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		children?: Snippet;
		class?: ClassValue;
	};

	let { children, class: className }: Props = $props();
</script>

<span
	class={cn(
		'inline-flex items-center px-3 text-ink-500',
		'has-[button,a]:px-0 has-[button,a]:last-of-type:mr-1 has-[button,a]:first-of-type:ml-1',
		className,
	)}
>
	{@render children?.()}
</span>
