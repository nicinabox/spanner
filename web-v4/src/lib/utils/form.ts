import type { SubmitFunction } from '$app/forms';
import { refreshAll } from '$app/navigation';

export interface FormError {
	id: string;
	title: string;
}

export const createInlineEnhance = ({
	onSuccess,
	onError,
}: { onSuccess?: () => void; onError?: () => void } = {}): SubmitFunction => {
	return () =>
		async ({ result, update }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				await refreshAll();
				onSuccess?.();
			} else {
				update({ navigate: false });
				onError?.();
			}
		};
};

export const enhanceInline = createInlineEnhance();
