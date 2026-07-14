import { requestEmailChange, deleteAccount, updateWebhookUrl } from '$lib/data/settings';
import { setPassword } from '$lib/data/session';
import { getCurrentUser } from '$lib/data/user';
import { withActionErrors } from '$lib/utils/actions';
import { decode, validate } from '$lib/utils/formData';
import { safeAsync } from '$lib/utils/async';
import { fail, redirect } from '@sveltejs/kit';
import { emailSchema, passwordSchema } from '$lib/schemas/auth';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';

const passwordMatchCheck = v.check(
	(value: { password: string; confirmPassword: string }) =>
		value.password === value.confirmPassword,
	'Passwords do not match',
);

const changeEmailSchema = v.object({ email: emailSchema });
const changePasswordSchema = v.pipe(
	v.object({
		password: passwordSchema,
		confirmPassword: v.string('Password confirmation is required'),
	}),
	v.forward(passwordMatchCheck, ['confirmPassword']),
);

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
		const parsed = await validate(decode(formData), changeEmailSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await requestEmailChange(parsed.data.email, locals);
		return { emailSuccess: true, email: parsed.data.email };
	}),

	changePassword: withActionErrors(async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), changePasswordSchema);
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
		const parsed = await validate(decode(formData), webhookFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await updateWebhookUrl(parsed.data.webhookUrl, locals);
		return { webhookSuccess: true, webhookUrl: parsed.data.webhookUrl };
	}),
} satisfies Actions;
