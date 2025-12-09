<script lang="ts">
	import insane from 'insane';
	import { marked } from 'marked';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		src: string;
	}

	let { src, ...props }: Props = $props();
</script>

<div {...props}>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html insane(marked(src, { async: false }))}
</div>
