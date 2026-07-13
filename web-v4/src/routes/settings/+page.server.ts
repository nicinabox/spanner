import { requestEmailChange, deleteAccount, updateWebhookUrl } from '$lib/data/settings';
import { setPassword } from '$lib/data/session';
import { getCurrentUser } from '$lib/data/user';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm, changeEmailSchema, changePasswordSchema } from '$lib/utils/schema';
import { safeAsync } from '$lib/utils/async';
import { fail, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';

const webhookFormSchema = v.object({
	webhookUrl: v.optional(v.string(''), ''),
});

export const load: PageServerLoad = async ({ locals }) => {
	const [user] = await safeAsync(getCurrentUser(locals));
	return {
		email: locals.session?.email,
		passwordEnabled: user?.passwordEnabled ?? false,
		webhookUrl: user?.preferences?.webhookUrl ?? '',
	};
};

export const actions = {
	changeEmail: withActionErrors(async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, changeEmailSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await requestEmailChange(parsed.data.email, locals);
		return { emailSuccess: true, email: parsed.data.email };
	}),

	changePassword: withActionErrors(async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, changePasswordSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await setPassword({ password: parsed.data.password }, locals);
		return { passwordSuccess: true };
	}),

	delete: withActionErrors(async ({ locals }) => {
		await deleteAccount(locals);
		redirect(303, '/');
	}),

	updateWebhook: withActionErrors(async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, webhookFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await updateWebhookUrl(parsed.data.webhookUrl, locals);
		return { webhookSuccess: true, webhookUrl: parsed.data.webhookUrl };
	}),
} satisfies Actions;
