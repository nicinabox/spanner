import { md } from '$lib/content';
import { error } from '@sveltejs/kit';

const RAW = import.meta.glob('/src/content/docs/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true,
}) as Record<string, string>;

const possibleFilenames = (slug: string) => {
	return [`${slug}.md`, `${slug}/index.md`, 'index.md'];
};

export const prerender = true;

export function load({ params }) {
	const raw = possibleFilenames(params.slug)
		.map((filename) => `/src/content/docs/${filename}`)
		.map((path) => RAW[path])
		.find((content) => content !== undefined);

	if (!raw) {
		throw error(404, 'Not found');
	}

	return md(raw);
}
