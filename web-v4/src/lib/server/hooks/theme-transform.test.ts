import { describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { createThemeTransform } from './theme-transform';

const makeEvent = (prefsCookie?: string): RequestEvent =>
	({
		request: new Request('http://localhost/'),
		cookies: {
			get: (name: string) => (name === 'prefs' ? prefsCookie : undefined),
		},
	}) as unknown as RequestEvent;

describe('createThemeTransform', () => {
	it('returns the resolved response', async () => {
		const handle = createThemeTransform();
		const next = new Response('ok');
		const resolve = vi.fn().mockResolvedValue(next);
		const result = await handle({
			event: makeEvent(),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);
		expect(result).toBe(next);
		expect(resolve).toHaveBeenCalledOnce();
	});

	it('passes transformPageChunk to resolve when theme is set', async () => {
		const handle = createThemeTransform();
		const resolve = vi.fn().mockResolvedValue(new Response());
		await handle({
			event: makeEvent('theme=dark'),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);
		const opts = resolve.mock.calls[0]![1] as {
			transformPageChunk: (input: { html: string }) => string;
		};
		expect(typeof opts.transformPageChunk).toBe('function');
	});

	it('transformPageChunk injects data-theme when theme is not auto', async () => {
		const handle = createThemeTransform();
		const next = new Response();
		const resolve = vi.fn().mockResolvedValue(next);
		await handle({
			event: makeEvent('theme=dark'),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);
		const opts = resolve.mock.calls[0]![1] as {
			transformPageChunk: (input: { html: string }) => string;
		};
		expect(opts.transformPageChunk({ html: '<html><body>x</body></html>' })).toBe(
			'<html data-theme="dark"><body>x</body></html>',
		);
	});

	it('does not inject data-theme when theme is auto', async () => {
		const handle = createThemeTransform();
		const next = new Response();
		const resolve = vi.fn().mockResolvedValue(next);
		await handle({
			event: makeEvent('theme=auto'),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);
		const opts = resolve.mock.calls[0]![1] as {
			transformPageChunk: (input: { html: string }) => string;
		};
		expect(opts.transformPageChunk({ html: '<html><body>x</body></html>' })).toBe(
			'<html><body>x</body></html>',
		);
	});

	it('does not inject when no theme cookie', async () => {
		const handle = createThemeTransform();
		const next = new Response();
		const resolve = vi.fn().mockResolvedValue(next);
		await handle({
			event: makeEvent(),
			resolve: resolve as never,
		} as Parameters<typeof handle>[0]);
		const opts = resolve.mock.calls[0]![1] as {
			transformPageChunk: (input: { html: string }) => string;
		};
		expect(opts.transformPageChunk({ html: '<html>x</html>' })).toBe('<html>x</html>');
	});
});
