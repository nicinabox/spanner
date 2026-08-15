import { parse } from '$lib/content';
import { startCase, toLower } from 'lodash-es';

const RAW = import.meta.glob<string>('./**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true,
	base: '/src/content',
}) as Record<string, string>;

const slugFromPath = (path: string): string => {
	const stripped = path.replace(/^\.\//, '').replace(/\.md$/, '');
	if (stripped === 'index') return '';
	return stripped.replace(/(\/|^)\d+-index$/, '').replace(/\/index$/, '');
};

/** Strip a leading `NN-` from each path segment so files can declare order. */
const stripNumberPrefix = (slug: string): string =>
	slug
		.split('/')
		.map((seg) => seg.replace(/^\d+-(.+)$/, '$1'))
		.join('/');

export type ContentEntry = {
	slug: string;
	title: string;
	excerpt: string;
};

const slugTitle = (path: string, raw: string): ContentEntry => {
	const fm = parse(raw);
	return {
		slug: stripNumberPrefix(slugFromPath(path)),
		title: (fm.data.title as string) ?? '',
		excerpt: fm.excerpt,
	};
};

// Preserve glob (filesystem) order. Number prefixes are stripped from slugs
// but otherwise act as visual ordering on disk.
export const raw = RAW;
export const entries: ContentEntry[] = Object.entries(RAW).map(([path, raw]) =>
	slugTitle(path, raw),
);

// Pure tree builder. Group by FIRST PATH SEGMENT (the folder), preserving glob
// order. Files at the root of the filesystem (no folder) live at tree.root.
export type DocPage = { slug: string; title: string; excerpt: string };
export type DocsGroup = { slug: string; title: string; pages: DocPage[] };
export type DocsTree = { root: DocPage[]; groups: DocsGroup[] };

export function buildTree(rawPaths: Record<string, string>): DocsTree {
	const root: ContentEntry[] = [];
	const buckets = new Map<string, ContentEntry[]>();
	const titles = new Map<string, string>();
	const groupOrder: string[] = [];

	for (const [path, raw] of Object.entries(rawPaths)) {
		// Determine group from the path's first segment. Empty segment means
		// the file is at the root of the content tree.
		const stripped = path.replace(/^\.\//, '').replace(/\.md$/, '');
		const firstSlash = stripped.indexOf('/');
		const isRoot = firstSlash < 0;
		// Strip number prefix from the folder segment to match page slugs.
		const groupRaw = isRoot ? null : stripped.slice(0, firstSlash);
		const group = groupRaw ? stripNumberPrefix(groupRaw) : null;

		const entry = slugTitle(path, raw);

		if (isRoot) {
			root.push(entry);
			continue;
		}

		if (!buckets.has(group!)) {
			buckets.set(group!, []);
			groupOrder.push(group!);
		}
		buckets.get(group!)!.push(entry);

		// Index file provides the group's title.
		if (/\/\d+-index$|\/index$/.test(stripped) || stripped === `${groupRaw}/index`) {
			titles.set(group!, entry.title);
		}
	}

	const groups: DocsGroup[] = groupOrder.map((groupSlug) => {
		const pages = buckets.get(groupSlug)!;
		const title = titles.get(groupSlug) ?? titleCase(groupSlug);
		// Index page (slug === groupSlug) goes first; others keep glob order.
		const sorted = [
			...pages.filter((p) => p.slug === groupSlug),
			...pages.filter((p) => p.slug !== groupSlug),
		];
		return {
			slug: groupSlug,
			title,
			pages: sorted,
		};
	});

	// Root: put the index (slug === '') first so the documentation landing
	// page sits at the top regardless of filesystem ordering.
	root.sort((a, b) => (a.slug === '' ? -1 : b.slug === '' ? 1 : 0));

	return { root, groups };
}

const titleCase = (s: string): string => startCase(toLower(s));

// Build the default tree from all content files.
export const tree: DocsTree = buildTree(RAW);

export function lookup(...parts: string[]): string | undefined {
	const joined = parts
		.flatMap((part) => part.split('/'))
		.filter(Boolean)
		.join('/');

	const dir = joined ? `./${joined}` : '.';
	const candidates = [`${dir}.md`, `${dir}/index.md`];

	// Direct path candidates (input matches disk name verbatim).
	const direct = candidates.map((filename) => RAW[filename]).find((v) => v);
	if (direct) return direct;

	// Fallback: match against any RAW key whose full stripped slug equals
	// the joined stripped path. Handles NN- prefixes declared on disk.
	const target = stripNumberPrefix(joined);
	for (const [key, value] of Object.entries(RAW)) {
		const keySlug = stripNumberPrefix(
			key
				.replace(/^\.\//, '')
				.replace(/\.md$/, '')
				.replace(/(\/|^)\d+-index$/, '')
				.replace(/\/index$/, ''),
		);
		if (keySlug === target) return value;
	}
	return undefined;
}
