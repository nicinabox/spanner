import * as v from 'valibot';

export const emailSchema = v.pipe(
	v.string("Email can't be blank"),
	v.trim(),
	v.minLength(1, "Email can't be blank"),
	v.regex(/^[^\s@]+@[^\s@]+$/, 'Enter a valid email address'),
);

export const passwordSchema = v.pipe(
	v.string('Password is required'),
	v.minLength(8, 'Password must be at least 8 characters'),
);
