<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		level: 1 | 2 | 3 | 4 | 5 | 6;
		id?: string;
		/** Show a permalink `#` link to the heading's anchor. */
		link?: boolean;
		children: Snippet;
	}

	let { level, id, link = false, children }: Props = $props();
</script>

<svelte:element this={`h${level}`} {id} class="scroll-mt-20 group">
	{@render children()}
	{#if link && id}
		<a
			href={`#${id}`}
			class="transition-opacity pointer-fine:opacity-0 group-hover:opacity-100 text-ink-300 hover:text-ink-600 no-underline ml-2 font-normal"
			aria-label="Link to this section"
		>
			#
		</a>
	{/if}
</svelte:element>
