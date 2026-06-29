declare module 'lodash-es' {
	export function orderBy<T>(
		collection: T[],
		iteratees: Array<((item: T) => unknown) | string> | ((item: T) => unknown) | string,
		orders: string | string[],
	): T[];
}

declare module 'insane' {
	export default function insane(
		html: string,
		options?: {
			allowedAttributes?: Record<string, string[]>;
			allowedClasses?: Record<string, string[]>;
			allowedTags?: string[];
		},
	): string;
}

declare const __APP_VERSION__: string;
declare const __HEAD_INJECTIONS__: string;
