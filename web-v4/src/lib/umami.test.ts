import { describe, expect, it } from 'vitest';
import { trackingUrl } from './umami';

describe('trackingUrl', () => {
	it('anonymizes protected routes to their pattern', () => {
		expect(trackingUrl('/(protected)/vehicles', '/vehicles')).toBe('/vehicles');
		expect(trackingUrl('/(protected)/vehicles/[id]', '/vehicles/123')).toBe('/vehicles/[id]');
		expect(trackingUrl('/(protected)/vehicles/[id]/notes', '/vehicles/123/notes')).toBe(
			'/vehicles/[id]/notes',
		);
		expect(trackingUrl('/(protected)/settings', '/settings')).toBe('/settings');
	});

	it('anonymizes token routes', () => {
		expect(trackingUrl('/login/[token]', '/login/abc')).toBe('/login/[token]');
		expect(trackingUrl('/reset-password/[token]', '/reset-password/abc')).toBe(
			'/reset-password/[token]',
		);
		expect(trackingUrl('/preferences/[token]', '/preferences/abc')).toBe('/preferences/[token]');
	});

	it('passes through public routes with their real pathname', () => {
		expect(trackingUrl('/docs/[...slug]', '/docs/foo/bar')).toBe('/docs/foo/bar');
		expect(trackingUrl('/share/vehicles/[id]', '/share/vehicles/42')).toBe('/share/vehicles/42');
		expect(trackingUrl('/', '/')).toBe('/');
	});

	it('passes through the pathname when there is no route id', () => {
		expect(trackingUrl(null, '/some/404')).toBe('/some/404');
	});
});
