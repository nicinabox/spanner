import { md } from '$lib/content';
import { error } from '@sveltejs/kit';
import { buildTree, raw as RAW, lookup } from '$lib/server/content';

export function load({ params }) {
	const raw = lookup('docs', params.slug);

	if (!raw) {
		throw error(404, 'Not found');
	}

	// Scope to docs paths for tree building. Strip the `./docs/` prefix so
	// slugs derived inside buildTree don't include `docs`.
	const scopedRaw: Record<string, string> = {};
	for (const [path, value] of Object.entries(RAW)) {
		if (path === './docs.md') {
			scopedRaw['./index.md'] = value;
		} else if (path.startsWith('./docs/')) {
			scopedRaw[`./${path.slice('./docs/'.length)}`] = value;
		}
	}
	const tree = buildTree(scopedRaw);

	return {
		...md(raw),
		tree,
	};
}
