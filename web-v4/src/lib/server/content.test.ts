import { describe, it, expect } from 'vitest';
import { matter } from 'gray-matter-es';
import { buildTree, lookup, raw, type ContentEntry } from './content';

/**
 * Build a RAW-shaped map from path entries. A path of `''` (or `index.md`) is
 * the root index file. A path with a leading segment is inside a folder.
 */
const r = (paths: { path: string; title: string }[]): Record<string, string> => {
	const map: Record<string, string> = {};
	for (const { path, title } of paths) {
		const p = path === '' || path === 'index' ? './index.md' : `./${path}.md`;
		map[p] = `---\ntitle: ${title}\n---\nBody text for ${title}.`;
	}
	return map;
};

describe('buildTree', () => {
	it('places root-level files at tree.root', () => {
		const tree = buildTree(r([{ path: 'index', title: 'Docs' }]));
		expect(tree.root[0].slug).toBe('');
		expect(tree.root[0].title).toBe('Docs');
		expect(tree.groups).toEqual([]);
	});

	it('places a root-level .md file at root, not in a single-page group', () => {
		const tree = buildTree(r([{ path: 'concepts', title: 'Concepts' }]));
		expect(tree.root[0].slug).toBe('concepts');
		expect(tree.root[0].title).toBe('Concepts');
		expect(tree.groups).toEqual([]);
	});

	it('groups files inside a folder by the folder slug', () => {
		const tree = buildTree(
			r([
				{ path: '02-vehicles/index', title: 'Vehicles' },
				{ path: '02-vehicles/adding-a-vehicle', title: 'Adding a vehicle' },
				{ path: '02-vehicles/editing-and-retiring', title: 'Editing and retiring' },
			]),
		);
		expect(tree.root).toEqual([]);
		expect(tree.groups).toHaveLength(1);
		expect(tree.groups[0].slug).toBe('vehicles');
		expect(tree.groups[0].pages).toHaveLength(3);
	});

	it('uses folder index page title as group title', () => {
		const tree = buildTree(
			r([
				{ path: '02-vehicles/index', title: 'Vehicles' },
				{ path: '02-vehicles/adding-a-vehicle', title: 'Adding a vehicle' },
			]),
		);
		expect(tree.groups[0].title).toBe('Vehicles');
	});

	it('falls back to title-cased slug when no index page', () => {
		const tree = buildTree(r([{ path: 'vehicles/adding-a-vehicle', title: 'Adding a vehicle' }]));
		expect(tree.groups[0].title).toBe('Vehicles');
	});

	it('handles kebab-case group slugs in fallback', () => {
		const tree = buildTree(r([{ path: 'reminders-and-schedules/foo', title: 'Foo' }]));
		expect(tree.groups[0].title).toBe('Reminders And Schedules');
	});

	it('preserves input order for pages within a group', () => {
		const tree = buildTree(
			r([
				{ path: '02-vehicles/index', title: 'Vehicles' },
				{ path: '02-vehicles/zeta', title: 'Zeta page' },
				{ path: '02-vehicles/alpha', title: 'Alpha page' },
			]),
		);
		expect(tree.groups[0].pages.map((p) => p.title)).toEqual([
			'Vehicles',
			'Zeta page',
			'Alpha page',
		]);
	});

	it('preserves input order for groups', () => {
		const tree = buildTree(
			r([
				{ path: 'zeta/index', title: 'Zeta' },
				{ path: 'zeta/foo', title: 'Zeta foo' },
				{ path: 'alpha/index', title: 'Alpha' },
				{ path: 'alpha/foo', title: 'Alpha foo' },
			]),
		);
		expect(tree.groups.map((g) => g.title)).toEqual(['Zeta', 'Alpha']);
	});

	it('handles deeply nested entries as their first-segment group', () => {
		const tree = buildTree(
			r([
				{ path: 'guides/sub/x', title: 'X' },
				{ path: 'guides/sub/y', title: 'Y' },
			]),
		);
		expect(tree.groups).toHaveLength(1);
		expect(tree.groups[0].slug).toBe('guides');
		expect(tree.groups[0].pages).toHaveLength(2);
	});

	it('returns empty tree for empty input', () => {
		const tree = buildTree({});
		expect(tree.root).toEqual([]);
		expect(tree.groups).toEqual([]);
	});

	it('keeps root-level files at root even when a folder has children', () => {
		// `concepts` is at root (no folder). `concepts/sub/page` is inside a
		// folder. Both should appear separately: concepts at root,
		// `concepts/sub/page` in the `concepts` group.
		const tree = buildTree(
			r([
				{ path: 'concepts', title: 'Concepts' },
				{ path: 'concepts/sub/x', title: 'X' },
			]),
		);
		expect(tree.root.map((p) => p.slug)).toContain('concepts');
		expect(tree.groups.find((g) => g.slug === 'concepts')).toBeDefined();
		expect(tree.groups.find((g) => g.slug === 'concepts')!.pages.map((p) => p.slug)).toEqual([
			'concepts/sub/x',
		]);
	});

	it('orders the root index first regardless of filesystem order', () => {
		const tree = buildTree(
			r([
				{ path: 'concepts', title: 'Concepts' },
				{ path: 'index', title: 'Documentation' },
			]),
		);
		expect(tree.root[0].slug).toBe('');
		expect(tree.root[0].title).toBe('Documentation');
		expect(tree.root[1].slug).toBe('concepts');
	});
});

// Helper: simulates lookup against an arbitrary RAW map.
function lookupFromFake(fakeRaw: Record<string, string>, ...parts: string[]): string | undefined {
	const joined = parts.flatMap((p) => p.split('/')).filter(Boolean).join('/');
	const dir = joined ? `./${joined}` : '.';
	const direct = [`${dir}.md`, `${dir}/index.md`]
		.map((filename) => fakeRaw[filename])
		.find((v) => v);
	if (direct) return direct;
	const stripNumberPrefix = (slug: string) =>
		slug
			.split('/')
			.map((seg) => seg.replace(/^\d+-(.+)$/, '$1'))
			.join('/');
	const target = stripNumberPrefix(joined);
	for (const [key, value] of Object.entries(fakeRaw)) {
		const keySlug = stripNumberPrefix(
			key.replace(/^\.\//, '').replace(/\.md$/, '').replace(/\/index$/, ''),
		);
		if (keySlug === target) return value;
	}
	return undefined;
}
