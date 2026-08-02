<script lang="ts">
	import sanitizeHtml from 'sanitize-html';
	import { marked } from 'marked';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		src: string;
	}

	let { src, ...props }: Props = $props();

	let html = $derived(
		(() => {
			const renderer = new marked.Renderer();
			renderer.heading = function ({ tokens, depth }: { tokens: any[]; depth: number }) {
				const text = renderer.parser.parseInline(tokens);
				const level = Math.max(Math.min(depth + 1, 6), 3);
				return `<h${level}>${text}</h${level}>`;
			};
			return sanitizeHtml(marked(src ?? '', { async: false, renderer }));
		})(),
	);
</script>

<div {...props}>
	{@html html}
</div>
