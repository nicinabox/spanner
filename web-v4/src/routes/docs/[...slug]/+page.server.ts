import { md } from '$lib/content';
import { error } from '@sveltejs/kit';
import { lookup, entries as contentEntries, RAW_CONTENT, buildTree } from '$lib/server/content';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () =>
	contentEntries
		.filter((entry) => entry.slug.startsWith('docs'))
		.map((entry) => ({ slug: entry.slug.replace(/^docs\/?/, '') }));

export const prerender = true;

export function load({ params }) {
	const raw = lookup('docs', params.slug);

	if (!raw) {
		throw error(404, 'Not found');
	}

	return {
		...md(raw),
		tree: buildTree(RAW_CONTENT, 'docs'),
	};
}
