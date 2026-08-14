<script lang="ts">
	import { marked } from 'marked';
	import type { Token } from 'marked';
	import sanitizeHtml from 'sanitize-html';
	import Heading from './Heading.svelte';
	import { asTextOnly, parameterize } from '$lib/content';

	interface HeadingLevels {
		/** Lowest rendered heading level (default 1). */
		min?: number;
		/** Highest rendered heading level (default 6). */
		max?: number;
		/** Shift applied to the source heading depth before clamping (default 0). */
		offset?: number;
	}

	interface Props {
		src: string;
		headingLevels?: HeadingLevels;
		linkHeadings?: boolean;
		class?: string;
	}

	let {
		src,
		headingLevels = {},
		linkHeadings: headingLink = false,
		class: className,
	}: Props = $props();

	type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
	const headingLevel = (depth: number): HeadingLevel => {
		const { min = 1, max = 6, offset = 0 } = headingLevels;
		return Math.max(min, Math.min(max, depth + offset)) as HeadingLevel;
	};

	const usedIds = new Map<string, number>();
	const uniqueId = (id: string): string => {
		const count = usedIds.get(id) ?? 0;
		usedIds.set(id, count + 1);
		return count === 0 ? id : `${id}-${count + 1}`;
	};

	const tokens = $derived.by(() => {
		usedIds.clear();
		return marked.lexer(src ?? '');
	});

	const inline = (tokens: Token[] | undefined) =>
		sanitizeHtml(marked.Parser.parseInline(tokens ?? [], { async: false }));

	const block = (raw: string) => sanitizeHtml(marked.parse(raw, { async: false }));
</script>

<div class={className}>
	{#each tokens as token, i (i)}
		{#if token.type === 'heading'}
			<Heading
				level={headingLevel(token.depth)}
				id={uniqueId(parameterize(asTextOnly(token.tokens)))}
				link={headingLink}
			>
				{@html inline(token.tokens)}
			</Heading>
		{:else if token.type !== 'space'}
			{@html block(token.raw)}
		{/if}
	{/each}
</div>
