import { PUBLIC_SENTRY_DSN } from '$app/env/public';
import { handleErrorWithSentry } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { browser } from '$app/env';
import { getCookieData, setCookieData } from '$lib/utils/cookies';

// At the top level, runs once on client
if (browser) {
	const existing = getCookieData('prefs') ?? {};
	const tz = ((new Date().getTimezoneOffset() / 60) * -1).toString();
	setCookieData('prefs', { ...existing, tz });
}

if (PUBLIC_SENTRY_DSN) {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 1.0,
		sendDefaultPii: true,
	});
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
