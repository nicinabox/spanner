import { defineEnvVars } from '@sveltejs/kit/hooks';
import * as v from 'valibot';

const boolean = (defaultValue: boolean) =>
	v.pipe(v.optional(v.string(), String(defaultValue)), v.parseBoolean());

export const variables = defineEnvVars({
	API_URL: {
		description: 'URL of the Spanner API backend',
	},

	CLIENT_SECRET: {
		description: 'Secret used to encrypt iron-session cookies',
	},

	WEB_URL: {
		description:
			'Public URL of the web frontend, used for email links. Falls back to request origin when empty.',
		schema: v.optional(v.string(), ''),
	},

	USE_SECURE_COOKIE: {
		description: 'Set to "false" for plain-HTTP local testing.',
		schema: boolean(true),
	},

	PUBLIC_EMAIL_ENABLED: {
		description:
			'Set to "true" if the API has email configured. Controls whether the magic link button is shown.',
		schema: boolean(true),
	},

	PUBLIC_SENTRY_DSN: {
		public: true,
		description: 'Sentry DSN for error tracking',
		schema: v.optional(v.string(), ''),
	},

	PUBLIC_UMAMI_CONFIG: {
		public: true,
		description:
			'Umami analytics config as URLSearchParams string (e.g. websiteId=xxx&scriptUrl=...)',
		schema: v.optional(v.string(), ''),
	},
});
