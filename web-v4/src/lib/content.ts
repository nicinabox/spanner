import { matter } from 'gray-matter-es';
import type { Token } from 'marked';
import * as env from '$app/env/public';

export function md(raw: string, ctx: Record<string, any> = env) {
	const src = Object.entries(ctx).reduce((acc, [k, v]) => {
		const pattern = new RegExp(`{{\\s?${k}\\s?}}`, 'g');
		return acc.replaceAll(pattern, v ?? '');
	}, raw);

	return matter(src);
}

type InlineToken = Token & { text?: string; tokens?: Token[] };

/** Plain-text content of inline markdown tokens (drops formatting, keeps code/text). */
export const asTextOnly = (tokens: Token[] | undefined): string =>
	(tokens ?? [])
		.map((token) => {
			if (typeof (token as InlineToken).text === 'string') return (token as InlineToken).text;
			if (Array.isArray((token as InlineToken).tokens) && (token as InlineToken).tokens!.length)
				return asTextOnly((token as InlineToken).tokens);
			return '';
		})
		.join('');

export const parameterize = (text: string): string =>
	text
		.toLowerCase()
		.trim()
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.replace(/[\s_]+/g, '-');
