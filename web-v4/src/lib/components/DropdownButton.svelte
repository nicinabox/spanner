<script lang="ts">
	import { ChevronDownIcon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLAttributes } from 'svelte/elements';

	type Props = {
		items?: string[];
		label?: string;
		children?: Snippet;
		open?: boolean;
		class?: ClassValue;
		onClickItem?: (item: string, ev: MouseEvent) => void;
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
		class: className
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

<details class={['group dropdown', className]} bind:open>
	<summary {...attributes?.button} class={['btn group-open:btn-active', attributes?.button?.class]}>
		{label}
		<ChevronDownIcon size={14} class="group-open:rotate-180" />
	</summary>
	<ul
		{...attributes?.menu}
		role="menu"
		class={[
			'dropdown-content menu z-1 mt-1 w-fit min-w-[200px] rounded-box bg-base-300 p-2 shadow-md',
			attributes?.menu?.class
		]}
	>
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
