import { md } from '$lib/content';
import { error } from '@sveltejs/kit';
import { buildTree, entries, lookup } from '$lib/server/content';

export const prerender = true;

export function load({ params }) {
	const raw = lookup('docs', params.slug);

	if (!raw) {
		throw error(404, 'Not found');
	}

	const scoped = entries.filter((e) => e.slug === '' || e.slug.startsWith('docs/'));
	const scopedSlugs = scoped.map((e) => ({
		...e,
		slug: e.slug.replace(/^docs\/?/, ''),
	}));
	const tree = buildTree(scopedSlugs);

	return {
		...md(raw),
		tree,
	};
}
