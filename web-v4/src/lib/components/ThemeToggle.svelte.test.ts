import { describe, it, expect, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ThemeToggle from './ThemeToggle.svelte';
import { getCookieData } from '#lib/utils/cookies.ts';

function systemPrefersDark(): boolean {
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

async function clickOption(name: 'Light' | 'Dark'): Promise<void> {
	const label = Array.from(document.querySelectorAll('label')).find((element) =>
		element.textContent?.includes(name),
	);
	if (!label) throw new Error(`no ${name} option rendered`);
	label.click();
	await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('ThemeToggle', () => {
	beforeEach(() => {
		document.documentElement.removeAttribute('data-theme');
		document.cookie = 'prefs=;path=/;max-age=0';
	});

	it('stores an override when the picked theme is not the system one', async () => {
		await render(ThemeToggle);
		const opposite = systemPrefersDark() ? 'Light' : 'Dark';

		await clickOption(opposite);

		expect(document.documentElement.getAttribute('data-theme')).toBe(opposite.toLowerCase());
		expect(getCookieData('prefs')).toEqual({ theme: opposite.toLowerCase() });
	});

	it('clears the override when the picked theme matches the system', async () => {
		await render(ThemeToggle);
		const system = systemPrefersDark() ? 'Dark' : 'Light';
		const opposite = systemPrefersDark() ? 'Light' : 'Dark';

		await clickOption(opposite);
		await clickOption(system);

		expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
		expect(getCookieData('prefs')).toEqual({ theme: 'auto' });
	});
});
