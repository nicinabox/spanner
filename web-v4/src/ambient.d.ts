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
