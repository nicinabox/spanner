import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { matter } from 'gray-matter-es';
import * as env from '$app/env/public';

export function md(raw: string, ctx: Record<string, any> = env) {
	const src = Object.entries(ctx).reduce((acc, [k, v]) => {
		const pattern = new RegExp(`{{\\s?${k}\\s?}}`, 'g');
		return acc.replaceAll(pattern, v ?? '');
	}, raw);

	const file = matter(src);
	const html = sanitizeHtml(marked(file.content, { async: false }));

	return {
		...file,
		html,
	};
}
