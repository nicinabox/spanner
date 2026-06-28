import { browser } from '$app/environment';

type DeferredPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredPrompt = $state<DeferredPromptEvent | null>(null);

export const initInstallPrompt = () => {
	if (!browser) return;

	window.addEventListener('beforeinstallprompt', (e: Event) => {
		e.preventDefault();
		deferredPrompt = e as DeferredPromptEvent;
	});

	window.addEventListener('appinstalled', () => {
		deferredPrompt = null;
	});
};

export const triggerInstallPrompt = async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
	if (!deferredPrompt) return 'unavailable';
	await deferredPrompt.prompt();
	const choice = await deferredPrompt.userChoice;
	deferredPrompt = null;
	return choice.outcome;
};