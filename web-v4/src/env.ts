import { defineEnvVars } from '@sveltejs/kit/hooks';
import * as v from 'valibot';

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
		schema: v.optional(v.string(), 'true'),
	},

	PUBLIC_EMAIL_ENABLED: {
		description:
			'Set to "true" if the API has email configured. Controls whether the magic link button is shown.',
		schema: v.optional(v.string(), 'true'),
	},

	PUBLIC_SENTRY_DSN: {
		public: true,
		description: 'Sentry DSN for error tracking',
		schema: v.optional(v.string(), ''),
	},
});
