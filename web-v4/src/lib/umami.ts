import { PUBLIC_UMAMI_CONFIG } from '$app/env/public';

interface UmamiConfig {
	websiteId: string;
	scriptUrl: string;
	hostUrl?: string;
	autoTrack?: boolean;
	domains?: string;
	tag?: string;
	performance?: boolean;
	excludeSearch?: boolean;
	excludeHash?: boolean;
	doNotTrack?: boolean;
}

function bool(value: string | null): boolean | undefined {
	if (value === 'true') return true;
	if (value === 'false') return false;
	return undefined;
}

const config: UmamiConfig | null = (() => {
	if (!PUBLIC_UMAMI_CONFIG) return null;

	const params = new URLSearchParams(PUBLIC_UMAMI_CONFIG);
	const websiteId = params.get('websiteId');
	if (!websiteId) return null;

	return {
		websiteId,
		scriptUrl: params.get('scriptUrl') ?? 'https://cloud.umami.is/script.js',
		hostUrl: params.get('hostUrl') ?? undefined,
		autoTrack: bool(params.get('autoTrack')),
		domains: params.get('domains') ?? undefined,
		tag: params.get('tag') ?? undefined,
		performance: bool(params.get('performance')),
		excludeSearch: bool(params.get('excludeSearch')),
		excludeHash: bool(params.get('excludeHash')),
		doNotTrack: bool(params.get('doNotTrack')),
	};
})();

function injectScript(cfg: UmamiConfig) {
	const s = document.createElement('script');
	s.src = cfg.scriptUrl;
	s.defer = true;
	s.dataset.websiteId = cfg.websiteId;

	if (cfg.hostUrl) s.dataset.hostUrl = cfg.hostUrl;
	if (cfg.autoTrack != null) s.dataset.autoTrack = String(cfg.autoTrack);
	if (cfg.domains) s.dataset.domains = cfg.domains;
	if (cfg.tag) s.dataset.tag = cfg.tag;
	if (cfg.performance != null) s.dataset.performance = String(cfg.performance);
	if (cfg.excludeSearch != null) s.dataset.excludeSearch = String(cfg.excludeSearch);
	if (cfg.excludeHash != null) s.dataset.excludeHash = String(cfg.excludeHash);
	if (cfg.doNotTrack != null) s.dataset.doNotTrack = String(cfg.doNotTrack);

	document.head.appendChild(s);
}

function handleClick(e: MouseEvent) {
	const el = (e.target as HTMLElement)?.closest('[data-umami-event]') as HTMLElement | null;
	if (!el || !window.umami) return;

	const eventName = el.dataset.umamiEvent;
	if (!eventName) return;

	const data: Record<string, string> = {};
	for (const [key, value] of Object.entries(el.dataset)) {
		if (key.startsWith('umamiEvent') && key !== 'umamiEvent') {
			data[key] = value as string;
		}
	}

	window.umami.track(eventName, data);
}

export function initUmami() {
	if (!config) return;

	injectScript(config);

	window.addEventListener('appinstalled', () => {
		window.umami?.track('pwa_install');
	});

	if (config.autoTrack) return;

	const handler = handleClick;
	document.addEventListener('click', handler);
	return () => document.removeEventListener('click', handler);
}

export function trackPageView(url: string | null) {
	if (!config || config.autoTrack || !window.umami) return;

	window.umami.track((props: Record<string, string>) => ({
		...props,
		url: url ?? props.url,
	}));
}

export function umamiEvent(
	event: string,
	data: Record<string, string> = {},
): Record<string, string> {
	if (!config) return {};

	const attrs: Record<string, string> = {
		'data-umami-event': event,
	};

	for (const [key, value] of Object.entries(data)) {
		attrs[`data-umami-event-${key}`] = value;
	}

	return attrs;
}
