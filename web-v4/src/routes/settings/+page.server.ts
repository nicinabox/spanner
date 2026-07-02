import { WEB_URL } from '$app/env/private';
import { requestEmailChange, deleteAccount, updateWebhookUrl } from '$lib/data/settings';
import { setPassword } from '$lib/data/session';
import { getCurrentUser } from '$lib/data/user';
import { getHTTPErrors } from '$lib/utils/actions';
import { parseForm, changeEmailSchema, changePasswordSchema } from '$lib/utils/schema';
import { safeAsync } from '$lib/utils/async';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [user] = await safeAsync(getCurrentUser(locals));
	return {
		email: locals.session?.email,
		passwordEnabled: user?.passwordEnabled ?? false,
		webhookUrl: user?.preferences?.webhookUrl ?? '',
	};
};

export const actions = {
	changeEmail: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, changeEmailSchema);

		if (parsed.errors) {
			return fail(422, { errors: parsed.errors });
		}

		const host = WEB_URL || url.origin;

		try {
			await requestEmailChange(parsed.data.email, host, locals);
			return { emailSuccess: true, email: parsed.data.email };
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	},

	changePassword: async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, changePasswordSchema);

		if (parsed.errors) {
			return fail(422, { errors: parsed.errors });
		}

		try {
			await setPassword({ password: parsed.data.password }, locals);
			return { passwordSuccess: true };
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	},

	delete: async ({ locals }) => {
		try {
			await deleteAccount(locals);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, '/');
	},

	updateWebhook: async ({ request, locals }) => {
		const formData = await request.formData();
		const webhookUrl = formData.get('webhookUrl') as string;

		try {
			await updateWebhookUrl(webhookUrl, locals);
			return { webhookSuccess: true };
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	},
} satisfies Actions;
