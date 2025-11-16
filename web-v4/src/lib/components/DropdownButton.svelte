<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		items?: string[];
		label?: string;
		children?: Snippet;
		open?: boolean;
		class?: ClassValue;
		onClickItem?: (item: string, ev: MouseEvent) => void;
	};

	let {
		open = $bindable(false),
		children,
		items = [],
		onClickItem,
		label,
		class: className
	}: Props = $props();

	$effect(() => {
		if (open) {
			const handler = (ev: MouseEvent) => {
				if (!(ev.target as Node)?.closest('details')) open = false;
				if ((ev.target as HTMLElement)?.closest('ul')) open = false;
			};
			document.addEventListener('click', handler, { once: true });
		}
	});
</script>

<details class={['dropdown', className]} bind:open>
	<summary class="btn">
		{label}
	</summary>
	<ul
		role="menu"
		class="dropdown-content menu z-1 w-fit min-w-[200px] rounded-box bg-base-200 p-2 shadow-lg"
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
