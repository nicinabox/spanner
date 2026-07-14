<script lang="ts">
	import { setContext } from 'svelte';
	import { cn } from 'tailwind-variants';
	import { inputVariants, type InputVariant, type InputSize } from './Input.svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		children?: Snippet;
		variant?: InputVariant;
		size?: InputSize;
		orientation?: 'horizontal' | 'vertical';
		class?: ClassValue;
		[key: string]: unknown;
	};

	let {
		children,
		variant = 'outline',
		size = 'md',
		orientation = 'horizontal',
		class: className,
		...rest
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	setContext('input-group', { variant: 'plain', size });

	let classes = $derived(
		cn(
			inputVariants({ variant, size }),
			'flex px-0 h-auto',
			'focus-within:bg-ink-50 focus-within:border-focus-ring focus-within:outline-2 focus-within:outline-focus-ring focus-within:outline-offset-0',
			orientation === 'horizontal' ? 'items-center' : 'flex-col',
			'[&>:where(input,textarea)]:flex-1 [&>:where(input,textarea)]:min-w-0',
			'[&>input:not(:first-child)]:pl-0 [&>input:not(:last-child)]:pr-0',
			className,
		),
	);
</script>

<div class={classes} {...rest}>
	{@render children?.()}
</div>
