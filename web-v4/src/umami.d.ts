interface Umami {
	track: {
		(eventName: string, data?: Record<string, string>): void;
		(transform: (props: Record<string, string>) => Record<string, string>): void;
	};
}

interface Window {
	umami?: Umami;
}
