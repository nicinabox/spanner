import { md } from '$lib/content';
import { error } from '@sveltejs/kit';

const RAW = import.meta.glob('/src/content/docs/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true,
}) as Record<string, string>;

export const prerender = true;

export function load({ params }) {
	const candidates = params.slug ? [`${params.slug}.md`, `${params.slug}/index.md`] : ['index.md'];

	const raw = candidates.map((filename) => RAW[`/src/content/docs/${filename}`]).find((v) => v);

	if (!raw) {
		throw error(404, 'Not found');
	}

	return md(raw);
}
