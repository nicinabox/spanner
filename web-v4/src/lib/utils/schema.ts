import * as v from 'valibot';
import type { FormError } from './form';

export function parseForm<TSchema extends v.GenericSchema>(
	formData: FormData,
	schema: TSchema,
):
	| { data: v.InferOutput<TSchema>; errors?: undefined }
	| { data?: undefined; errors: FormError[] } {
	const entries: Record<string, unknown> = {};
	for (const [key, value] of formData.entries()) {
		// Keep the last value when a key appears multiple times.
		entries[key] = value;
	}

	const result = v.safeParse(schema, entries);
	if (result.success) {
		return { data: result.output };
	}

	return { errors: result.issues.map(issueToFormError) };
}

function issueToFormError(issue: v.BaseIssue<unknown>): FormError {
	const path =
		issue.path
			?.map((p) => (typeof p === 'string' ? p : 'key' in p ? p.key : String(p)))
			.join('.') ?? 'form';
	return { id: path, title: issue.message };
}

export const emailSchema = v.pipe(
	v.string("Email can't be blank"),
	v.trim(),
	v.minLength(1, "Email can't be blank"),
	v.email('Enter a valid email address'),
);

export const passwordSchema = v.pipe(
	v.string('Password is required'),
	v.minLength(8, 'Password must be at least 8 characters'),
);

const passwordMatchCheck = v.check(
	(value: { password: string; confirm_password: string }) =>
		value.password === value.confirm_password,
	'Passwords do not match',
);

export const resetPasswordSchema = v.pipe(
	v.object({
		password: passwordSchema,
		confirm_password: v.string('Password confirmation is required'),
	}),
	v.forward(passwordMatchCheck, ['confirm_password']),
);

export const changePasswordSchema = resetPasswordSchema;

export const requestResetSchema = v.object({
	email: emailSchema,
});

export const changeEmailSchema = v.object({
	email: emailSchema,
});

export const loginSchema = v.object({
	email: emailSchema,
	password: v.optional(v.string(), ''),
});

export const tokenSchema = v.object({
	token: v.pipe(v.string("Token can't be blank"), v.trim(), v.minLength(1, "Token can't be blank")),
});
