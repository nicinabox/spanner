declare module 'lodash-es' {
	export function orderBy<T>(
		collection: T[],
		iteratees: Array<((item: T) => unknown) | string> | ((item: T) => unknown) | string,
		orders: string | string[],
	): T[];
}

declare module 'insane' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export default function insane(
		html: string,
		options?: {
			allowedAttributes?: Record<string, string[]>;
			allowedClasses?: Record<string, string[]>;
			allowedTags?: string[];
		},
	): string;
}
