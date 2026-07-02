const STORAGE_PREFIX = 'spanner-draft:';

export function saveDraft(key: string, value: string) {
	try {
		localStorage.setItem(STORAGE_PREFIX + key, value);
	} catch {
		// localStorage might be full or unavailable
	}
}

export function loadDraft(key: string): string | null {
	try {
		return localStorage.getItem(STORAGE_PREFIX + key);
	} catch {
		return null;
	}
}

export function clearDraft(key: string) {
	try {
		localStorage.removeItem(STORAGE_PREFIX + key);
	} catch {
		// ignore
	}
}
