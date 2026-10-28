/**
 * Two-state theme model.
 *
 * The stored preference is either an explicit override (`light`/`dark`) or
 * `auto`, which means "follow the system". The toggle only stores an override
 * when the user picks the opposite of what the system already shows, so
 * toggling back to the system value returns to `auto` instead of pinning it.
 * See https://lea.verou.me/blog/2026/dark-mode-toggles/
 */

export type Theme = 'light' | 'dark';
export type ThemePref = Theme | 'auto';

export function isTheme(value: string | undefined): value is Theme {
	return value === 'light' || value === 'dark';
}

/** The theme actually rendered: the override if set, otherwise the system one. */
export function resolveTheme(pref: ThemePref, systemPrefersDark: boolean): Theme {
	if (pref !== 'auto') return pref;
	return systemPrefersDark ? 'dark' : 'light';
}

/**
 * The preference to store after the user toggles away from `current`.
 * Returns `auto` when the new theme matches the system, so no override is kept.
 */
export function nextThemePref(current: Theme, systemPrefersDark: boolean): ThemePref {
	const target: Theme = current === 'dark' ? 'light' : 'dark';
	const system: Theme = systemPrefersDark ? 'dark' : 'light';
	return target === system ? 'auto' : target;
}
