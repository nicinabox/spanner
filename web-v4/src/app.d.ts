import { type Session } from '#lib/data/session.ts';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			authToken: string | undefined;
			session: Session | null | undefined;
			webUrl: string;
			isMobile: boolean;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
