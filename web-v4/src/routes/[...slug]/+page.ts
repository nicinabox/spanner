import { md } from '$lib/content';
import { error } from '@sveltejs/kit';

const RAW = import.meta.glob('/src/content/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true,
}) as Record<string, string>;

export const prerender = true;

export function load({ params }) {
	const raw = RAW[`/src/content/${params.slug}.md`];

	if (!raw) {
		throw error(404, 'Not found');
	}

	return md(raw);
}
