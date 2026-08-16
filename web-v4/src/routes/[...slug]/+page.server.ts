import type { EntryGenerator } from './$types';
import { md } from '$lib/content';
import { error } from '@sveltejs/kit';
import { lookup, entries as contentEntries } from '$lib/server/content';

export const entries: EntryGenerator = () =>
	contentEntries.filter((entry) => !entry.slug.startsWith('docs'));

export const prerender = true;

export function load({ params }) {
	const raw = lookup(params.slug);

	if (!raw) {
		throw error(404, 'Not found');
	}

	return md(raw);
}
