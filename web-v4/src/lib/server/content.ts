import { parse } from '$lib/content';
import { startCase, toLower } from 'lodash-es';

export const RAW_CONTENT = import.meta.glob<string>('./**/*.md', {
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
export const entries: ContentEntry[] = Object.entries(RAW_CONTENT).map(([path, raw]) =>
	slugTitle(path, raw),
);

// Pure tree builder. Group by FIRST PATH SEGMENT (the folder), preserving glob
// order. Files at the root of the filesystem (no folder) live at tree.root.
// When `base` is given, only paths under that folder are included and the
// prefix is stripped before grouping.
export type DocPage = { slug: string; title: string; excerpt: string };
export type DocsGroup = { slug: string; title: string; pages: DocPage[] };
export type DocsTree = { root: DocPage[]; groups: DocsGroup[] };

export function buildTree(rawPaths: Record<string, string>, base = ''): DocsTree {
	const root: ContentEntry[] = [];
	const buckets = new Map<string, ContentEntry[]>();
	const titles = new Map<string, string>();
	const groupOrder: string[] = [];

	for (const [path, raw] of Object.entries(rawPaths)) {
		// Resolve the path relative to the base folder. Paths outside the base
		// subtree are excluded; the base prefix is stripped from the rest.
		let rel = path.replace(/^\.\//, '').replace(/\.md$/, '');
		if (base) {
			if (rel === base) {
				rel = '';
			} else if (rel.startsWith(`${base}/`)) {
				rel = rel.slice(base.length + 1);
			} else {
				continue;
			}
		}

		// Determine group from the path's first segment. Empty segment means
		// the file is at the root of the content tree.
		const firstSlash = rel.indexOf('/');
		const isRoot = firstSlash < 0;
		// Strip number prefix from the folder segment to match page slugs.
		const groupRaw = isRoot ? null : rel.slice(0, firstSlash);
		const group = groupRaw ? stripNumberPrefix(groupRaw) : null;

		const entry = slugTitle(rel, raw);

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
		if (/\/\d+-index$|\/index$/.test(rel) || rel === `${groupRaw}/index`) {
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
export const tree: DocsTree = buildTree(RAW_CONTENT);

export function lookup(...parts: string[]): string | undefined {
	const joined = parts
		.flatMap((part) => part.split('/'))
		.filter(Boolean)
		.join('/');

	const dir = joined ? `./${joined}` : '.';
	const candidates = [`${dir}.md`, `${dir}/index.md`];

	// Direct path candidates (input matches disk name verbatim).
	const direct = candidates.map((filename) => RAW_CONTENT[filename]).find((v) => v);
	if (direct) return direct;

	// Fallback: match against any RAW key whose full stripped slug equals
	// the joined stripped path. Handles NN- prefixes declared on disk.
	const target = stripNumberPrefix(joined);
	for (const [key, value] of Object.entries(RAW_CONTENT)) {
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
