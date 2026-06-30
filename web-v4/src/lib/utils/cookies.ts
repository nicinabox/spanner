/**
 * Read structured data from a cookie on the client side.
 * The cookie value is expected to be in URLSearchParams format (e.g. `tz=-5&theme=dark`).
 * Returns `null` if the cookie doesn't exist.
 *
 * @example
 * const prefs = getCookieData('prefs');
 * // => { tz: "-5", theme: "dark" } or null
 */
export function getCookieData(name: string): Record<string, string> | null {
	if (typeof document === 'undefined') return null;
	const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
	if (!match) return null;
	const value = match.split('=').slice(1).join('=');
	return Object.fromEntries(new URLSearchParams(value));
}

/**
 * Write structured data to a cookie on the client side.
 * Serializes the data as URLSearchParams format (e.g. `tz=-5&theme=dark`).
 *
 * @example
 * setCookieData('prefs', { tz: '-5', theme: 'dark' });
 */
export function setCookieData(
	name: string,
	data: Record<string, string>,
	options?: { maxAge?: number; path?: string },
): void {
	if (typeof document === 'undefined') return;
	const path = options?.path ?? '/';
	const maxAge = options?.maxAge ?? 86400;
	document.cookie = `${name}=${new URLSearchParams(data)};path=${path};max-age=${maxAge}`;
}
