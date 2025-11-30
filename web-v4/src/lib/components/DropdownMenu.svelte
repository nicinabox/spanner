<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronDownIcon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLAttributes } from 'svelte/elements';
	import { buttonVariants, type ButtonSize, type ButtonVariant } from './ui/Button.svelte';

	type Props = {
		items?: string[];
		label?: string;
		children?: Snippet;
		open?: boolean;
		class?: ClassValue;
		onClickItem?: (item: string, ev: MouseEvent) => void;
		variant?: ButtonVariant;
		size?: ButtonSize;
		attributes?: {
			button?: HTMLAttributes<HTMLElement>;
			menu?: HTMLAttributes<HTMLUListElement>;
		};
	};

	let {
		open = $bindable(false),
		children,
		items = [],
		onClickItem,
		label,
		attributes,
		class: className,
		variant,
		size
	}: Props = $props();

	$effect(() => {
		if (open) {
			const handler = (ev: MouseEvent) => {
				if (!(ev.target as HTMLElement)?.closest('details')) open = false;
				if ((ev.target as HTMLElement)?.closest('ul')) open = false;
			};
			document.addEventListener('click', handler, { once: true });
		}
	});
</script>

<details class={['group menu', className]} data-size={size} bind:open>
	<summary
		{...attributes?.button}
		class={cn(buttonVariants({ variant, size }), 'menu-button', attributes?.button?.class)}
	>
		{label}
		<ChevronDownIcon size={14} class="group-open:rotate-180" />
	</summary>
	<ul {...attributes?.menu} role="menu" class={attributes?.menu?.class}>
		{#if children}
			{@render children?.()}
		{:else}
			{#each items as item, i (i)}
				<li role="menuitem">
					<button onclick={(ev) => onClickItem?.(item, ev)}>{item}</button>
				</li>
			{/each}
		{/if}
	</ul>
</details>
