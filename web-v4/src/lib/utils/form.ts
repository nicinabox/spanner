import { invalidateAll } from '$app/navigation';
import type { SubmitFunction } from '@sveltejs/kit';

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
				await invalidateAll();
				onSuccess?.();
			} else {
				update();
				onError?.();
			}
		};
};

export const enhanceInline = createInlineEnhance();
