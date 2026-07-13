import { PUBLIC_EMAIL_ENABLED } from '$app/env/private';
import * as session from '$lib/data/session';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setSession } from '$lib/utils/session';
import { getCurrentUser } from '$lib/data/user';
import { safeAsync } from '$lib/utils/async';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm } from '$lib/utils/schema';
import { emailSchema, passwordSchema } from '$lib/schemas/auth';
import * as v from 'valibot';

const loginSchema = v.object({
	email: emailSchema,
	password: v.optional(passwordSchema, ''),
});

const tokenSchema = v.object({
	token: v.pipe(v.string("Token can't be blank"), v.trim(), v.minLength(1, "Token can't be blank")),
});

const isRedirect = (error: unknown): boolean =>
	typeof error === 'object' && error !== null && 'location' in error;

export const load: PageServerLoad = async ({ locals }) => {
	const [user] = await safeAsync(getCurrentUser(locals));

	if (user) {
		return redirect(307, '/vehicles');
	}

	return {
		emailEnabled: PUBLIC_EMAIL_ENABLED !== 'false',
	};
};

export const actions = {
	login: withActionErrors(async ({ request, cookies, locals }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, loginSchema);
		if (parsed.errors) return fail(401, { errors: parsed.errors });

		const timeZoneOffset = formData.get('timeZoneOffset') as string | null;

		try {
			const result = await session.login({
				email: parsed.data.email,
				password: parsed.data.password || undefined,
				timeZoneOffset: timeZoneOffset || undefined,
			}, locals);

			if (result && typeof result === 'object' && 'authToken' in result) {
				await setSession(cookies, result as session.Session);
				redirect(303, '/vehicles');
			}

			return { status: 'pending' };
		} catch (error) {
			if (isRedirect(error)) throw error;
			return fail(401, {
				errors: [{ id: 'form', title: 'Invalid email or password' }],
			});
		}
	}),

	magicLink: withActionErrors(async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, loginSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		try {
			await session.login({
				email: parsed.data.email,
			}, locals);

			return { status: 'pending' };
		} catch (error) {
			if (isRedirect(error)) throw error;
			return fail(422, {
				errors: [{ id: 'form', title: 'Could not send magic link. Please try again.' }],
			});
		}
	}),

	signinWithToken: withActionErrors(async ({ cookies, request }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, tokenSchema);
		if (parsed.errors) return fail(422, { status: 'pending', errors: parsed.errors });

		const sess = await session.signin(parsed.data.token);
		await setSession(cookies, sess);
		redirect(303, '/vehicles');
	}),
} satisfies Actions;
