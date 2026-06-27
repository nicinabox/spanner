import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';

if (PUBLIC_SENTRY_DSN) {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 1.0,
	});
}
