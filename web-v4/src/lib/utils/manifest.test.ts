import { describe, it, expect } from 'vitest';
import manifest from '../../../static/manifest.json';

describe('PWA manifest', () => {
	it('has a name', () => {
		expect(manifest.name).toBe('Spanner');
	});

	it('has a short name', () => {
		expect(manifest.short_name).toBe('Spanner');
	});

	it('uses standalone display mode', () => {
		expect(manifest.display).toBe('standalone');
	});

	it('starts at root', () => {
		expect(manifest.start_url).toBe('/');
	});

	it('scopes to root', () => {
		expect(manifest.scope).toBe('/');
	});

	it('has a 192x192 icon with purpose any', () => {
		const icon = manifest.icons.find(
			(i) => i.sizes === '192x192' && i.purpose === 'any'
		);
		expect(icon).toBeDefined();
		expect(icon!.src).toBe('/icons/apple-touch-icon-192.png');
	});

	it('has a 512x512 icon with purpose any', () => {
		const icon = manifest.icons.find(
			(i) => i.sizes === '512x512' && i.purpose === 'any'
		);
		expect(icon).toBeDefined();
		expect(icon!.src).toBe('/icons/apple-touch-icon-512.png');
	});

	it('has a 512x512 icon with purpose maskable', () => {
		const icon = manifest.icons.find(
			(i) => i.sizes === '512x512' && i.purpose === 'maskable'
		);
		expect(icon).toBeDefined();
		expect(icon!.src).toBe('/icons/apple-touch-icon-512.png');
	});
});
