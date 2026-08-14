import { md } from '$lib/content';
import { error } from '@sveltejs/kit';
import { lookup } from '$lib/server/content';

export const prerender = true;

export function load({ params }) {
	const raw = lookup(params.slug);

	if (!raw) {
		throw error(404, 'Not found');
	}

	return md(raw);
}
