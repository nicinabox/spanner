import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCookieData, setCookieData } from './cookies';

beforeEach(() => {
	let cookieStore = '';
	vi.stubGlobal('document', {
		get cookie() {
			return cookieStore;
		},
		set cookie(value: string) {
			cookieStore = value;
		},
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('getCookieData', () => {
	it('returns null when cookie does not exist', () => {
		expect(getCookieData('prefs')).toBeNull();
	});

	it('returns null when no matching cookie exists', () => {
		document.cookie = 'other=value';
		expect(getCookieData('prefs')).toBeNull();
	});

	it('parses a URLSearchParams cookie value', () => {
		document.cookie = 'prefs=tz=-5&theme=dark';
		expect(getCookieData('prefs')).toEqual({ tz: '-5', theme: 'dark' });
	});

	it('handles a single key-value pair', () => {
		document.cookie = 'prefs=tz=-5';
		expect(getCookieData('prefs')).toEqual({ tz: '-5' });
	});

	it('returns null when document is undefined', () => {
		vi.stubGlobal('document', undefined);
		expect(getCookieData('prefs')).toBeNull();
	});
});

describe('setCookieData', () => {
	it('writes a URLSearchParams cookie', () => {
		setCookieData('prefs', { tz: '-5', theme: 'dark' });
		expect(document.cookie).toContain('prefs=');
		const match = document.cookie.match(/prefs=([^;]+)/);
		expect(match).not.toBeNull();
		const entries = new URLSearchParams(match![1]);
		expect(Object.fromEntries(entries)).toEqual({ tz: '-5', theme: 'dark' });
	});

	it('writes with custom maxAge and path', () => {
		setCookieData('prefs', { theme: 'dark' }, { maxAge: 3600, path: '/app' });
		expect(document.cookie).toContain('max-age=3600');
		expect(document.cookie).toContain('path=/app');
	});

	it('does nothing when document is undefined', () => {
		vi.stubGlobal('document', undefined);
		expect(() => setCookieData('prefs', { tz: '-5' })).not.toThrow();
	});
});
