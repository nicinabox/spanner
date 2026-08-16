import { describe, expect, it } from 'vitest';
import { trackingUrl } from './umami';

describe('trackingUrl', () => {
	it('anonymizes protected vehicle routes to their pattern', () => {
		expect(trackingUrl('/(protected)/vehicles', '/vehicles')).toBe('/vehicles');
		expect(trackingUrl('/(protected)/vehicles/[id]', '/vehicles/123')).toBe('/vehicles/[id]');
		expect(trackingUrl('/(protected)/vehicles/[id]/notes', '/vehicles/123/notes')).toBe(
			'/vehicles/[id]/notes',
		);
	});

	it('anonymizes protected settings routes to their pattern', () => {
		expect(trackingUrl('/(protected)/settings', '/settings')).toBe('/settings');
		expect(trackingUrl('/(protected)/settings', '/settings')).toBe('/settings');
	});

	it('passes through public routes with their real pathname', () => {
		expect(trackingUrl('/docs/[...slug]', '/docs/foo/bar')).toBe('/docs/foo/bar');
		expect(trackingUrl('/share/vehicles/[id]', '/share/vehicles/42')).toBe(
			'/share/vehicles/42',
		);
		expect(trackingUrl('/', '/')).toBe('/');
	});

	it('returns null for redacted token routes', () => {
		expect(trackingUrl('/login/[token]', '/login/abc')).toBeNull();
		expect(trackingUrl('/reset-password/[token]', '/reset-password/abc')).toBeNull();
		expect(trackingUrl('/preferences/[token]', '/preferences/abc')).toBeNull();
	});

	it('passes through the pathname when there is no route id', () => {
		expect(trackingUrl(null, '/some/404')).toBe('/some/404');
	});
});
