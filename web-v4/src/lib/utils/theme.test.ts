import { describe, it, expect } from 'vitest';
import { isTheme, nextThemePref, resolveTheme } from './theme';

describe('resolveTheme', () => {
	it('prefers an explicit override over the system', () => {
		expect(resolveTheme('light', true)).toBe('light');
		expect(resolveTheme('dark', false)).toBe('dark');
	});

	it('follows the system when the preference is auto', () => {
		expect(resolveTheme('auto', true)).toBe('dark');
		expect(resolveTheme('auto', false)).toBe('light');
	});
});

describe('nextThemePref', () => {
	it('stores an override when the target differs from the system', () => {
		// system light, user flips to dark
		expect(nextThemePref('light', false)).toBe('dark');
		// system dark, user flips to light
		expect(nextThemePref('dark', true)).toBe('light');
	});

	it('clears the override when the target matches the system', () => {
		// system dark, user flips to light... system is light here already
		expect(nextThemePref('dark', false)).toBe('auto');
		// system light, user flips to dark while system is dark
		expect(nextThemePref('light', true)).toBe('auto');
	});

	it('round-trips back to auto after two toggles', () => {
		const first = nextThemePref(resolveTheme('auto', false), false);
		expect(first).toBe('dark');
		const second = nextThemePref(resolveTheme(first, false), false);
		expect(second).toBe('auto');
	});
});

describe('isTheme', () => {
	it('accepts only light and dark', () => {
		expect(isTheme('light')).toBe(true);
		expect(isTheme('dark')).toBe(true);
		expect(isTheme('auto')).toBe(false);
		expect(isTheme(undefined)).toBe(false);
	});
});
