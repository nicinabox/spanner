import { describe, it, expect } from 'vitest';
import { matter } from 'gray-matter-es';
import { buildTree, lookup, raw, type ContentEntry } from './content';

const e = (slug: string, title: string): ContentEntry => ({ slug, title });

describe('buildTree', () => {
	it('places top-level entries in root', () => {
		const tree = buildTree([e('', 'Docs')]);
		expect(tree.root).toEqual([{ slug: '', title: 'Docs' }]);
		expect(tree.groups).toEqual([]);
	});

	it('groups nested entries by first segment', () => {
		const tree = buildTree([
			e('vehicles', 'Vehicles'),
			e('vehicles/adding-a-vehicle', 'Adding a vehicle'),
			e('vehicles/editing-and-retiring', 'Editing and retiring'),
		]);
		expect(tree.root).toEqual([]);
		expect(tree.groups).toHaveLength(1);
		expect(tree.groups[0].slug).toBe('vehicles');
		expect(tree.groups[0].pages).toHaveLength(3);
	});

	it('uses index entry title as group title', () => {
		const tree = buildTree([
			e('vehicles', 'Vehicles'),
			e('vehicles/adding-a-vehicle', 'Adding a vehicle'),
		]);
		expect(tree.groups[0].title).toBe('Vehicles');
	});

	it('uses index/foo entry title when no bare group entry exists', () => {
		const tree = buildTree([
			e('vehicles/index', 'Vehicles'),
			e('vehicles/adding-a-vehicle', 'Adding a vehicle'),
		]);
		expect(tree.groups[0].title).toBe('Vehicles');
	});

	it('falls back to title-cased slug when no index entry', () => {
		const tree = buildTree([e('vehicles/adding-a-vehicle', 'Adding a vehicle')]);
		expect(tree.groups[0].title).toBe('Vehicles');
	});

	it('handles kebab-case group slugs in fallback', () => {
		const tree = buildTree([e('reminders-and-schedules/foo', 'Foo')]);
		expect(tree.groups[0].title).toBe('Reminders And Schedules');
	});

	it('preserves input order for pages within a group', () => {
		const tree = buildTree([
			e('vehicles', 'Vehicles'),
			e('vehicles/zeta', 'Zeta page'),
			e('vehicles/alpha', 'Alpha page'),
		]);
		// Order matches input: Vehicles, Zeta, Alpha (not alphabetical).
		expect(tree.groups[0].pages.map((p) => p.title)).toEqual([
			'Vehicles',
			'Zeta page',
			'Alpha page',
		]);
	});

	it('preserves input order for groups', () => {
		const tree = buildTree([
			e('zeta', 'Zeta'),
			e('zeta/foo', 'Zeta foo'),
			e('alpha', 'Alpha'),
			e('alpha/foo', 'Alpha foo'),
		]);
		expect(tree.groups.map((g) => g.title)).toEqual(['Zeta', 'Alpha']);
	});

	it('handles deeply nested entries as their first-segment group', () => {
		const tree = buildTree([e('guides/sub/x', 'X'), e('guides/sub/y', 'Y')]);
		expect(tree.groups).toHaveLength(1);
		expect(tree.groups[0].slug).toBe('guides');
		expect(tree.groups[0].pages).toHaveLength(2);
	});

	it('returns empty tree for empty input', () => {
		const tree = buildTree([]);
		expect(tree.root).toEqual([]);
		expect(tree.groups).toEqual([]);
	});
});

describe('lookup', () => {
	it('finds content at the root with empty prefix', () => {
		// regression: empty prefix must not produce a doubled slash in the key
		const result = lookup('colophon');
		expect(result).toBeDefined();
		expect(result).toBe(raw['./colophon.md']);
	});

	it('finds content under a scoped prefix', () => {
		const result = lookup('docs', 'vehicles');
		expect(result).toBeDefined();
	});

	it('returns undefined for missing content', () => {
		expect(lookup('does-not-exist')).toBeUndefined();
		expect(lookup('docs', 'does-not-exist')).toBeUndefined();
	});

	it('handles nested slug lookup', () => {
		const result = lookup('docs', 'vehicles/adding-a-vehicle');
		expect(result).toBeDefined();
	});
});

describe('number prefix', () => {
	// Each path simulates a glob key with a number-prefixed segment.
	const fakeRaw: Record<string, string> = {
		'./01-foo.md': '---\ntitle: Foo\n---\nbody',
		'./01-foo/02-bar.md': '---\ntitle: Bar\n---\nbody',
		'./foo-01-bar.md': '---\ntitle: Mid\n---\nbody',
		'./01.md': '---\ntitle: Just digits\n---\nbody',
	};

	const buildFromFake = () => {
		const slugFromPath = (path: string) => {
			const stripped = path.replace(/^\.\//, '').replace(/\.md$/, '');
			if (stripped === 'index') return '';
			return stripped.replace(/\/index$/, '');
		};
		const stripNumberPrefix = (slug: string) =>
			slug
				.split('/')
				.map((seg) => seg.replace(/^\d+-(.+)$/, '$1'))
				.join('/');

		return Object.entries(fakeRaw).map(([path, raw]) => {
			const fm = matter(raw).data as { title?: string };
			return {
				slug: stripNumberPrefix(slugFromPath(path)),
				title: fm.title ?? '',
			};
		});
	};

	it('strips leading number prefix from a single segment', () => {
		const entries = buildFromFake();
		const tree = buildTree(entries);
		const group = tree.groups.find((g) => g.slug === 'foo');
		expect(group).toBeDefined();
		expect(group!.pages.map((p) => p.title)).toContain('Foo');
		expect(group!.pages.map((p) => p.title)).toContain('Bar');
	});

	it('strips a number prefix from each segment of a nested slug', () => {
		const entries = buildFromFake();
		const found = entries.find((e) => e.slug === 'foo/bar');
		expect(found).toBeDefined();
		expect(found!.title).toBe('Bar');
	});

	it('preserves a number mid-name', () => {
		const entries = buildFromFake();
		const found = entries.find((e) => e.slug === 'foo-01-bar');
		expect(found).toBeDefined();
	});

	it('preserves a segment that is only digits', () => {
		const entries = buildFromFake();
		const found = entries.find((e) => e.slug === '01');
		expect(found).toBeDefined();
	});

	it('lookup finds number-prefixed file via stripped slug', () => {
		// ./01-foo.md on disk, slug 'foo'; lookup('', 'foo') resolves it.
		const result = lookupFromFake(fakeRaw, '', 'foo');
		expect(result).toBe(fakeRaw['./01-foo.md']);
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
