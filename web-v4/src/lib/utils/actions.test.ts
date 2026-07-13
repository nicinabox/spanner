import { describe, it, expect } from 'vitest';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { requireField, withActionErrors } from './actions';

const formDataFrom = (obj: Record<string, string>) => {
	const fd = new FormData();
	for (const [k, v] of Object.entries(obj)) fd.append(k, v);
	return fd;
};

const fakeEvent = (formData: FormData) =>
	({
		request: { formData: async () => formData },
	}) as never;

describe('requireField', () => {
	it('returns null when the field has a truthy value', () => {
		expect(requireField({ email: 'a@b.com' }, 'email', 'Email is required')).toBeNull();
	});

	it('returns a FormError list when the field is empty/missing', () => {
		expect(requireField({ email: '' }, 'email', 'Email is required')).toEqual({
			errors: [{ id: 'email', title: 'Email is required' }],
		});
	});

	it('uses the field key as the error id', () => {
		const err = requireField({}, 'mileage', 'Mileage is required');
		expect(err?.errors[0].id).toBe('mileage');
	});
});

describe('withActionErrors', () => {
	it('returns the handler result on success and preserves its type', async () => {
		const handler = async () => ({ status: 'pending' as const });
		const wrapped = withActionErrors(handler);
		const result = await wrapped(fakeEvent(formDataFrom({})));

		expect(result).toEqual({ status: 'pending' });
	});

	it('preserves the handler return type through the wrapper (TS check)', async () => {
		// Compile-time assertion: the wrapped signature must keep the event
		// parameter and thread TResult through to the return. If the wrapper
		// erases the event type, this block fails to compile.
		const wrapped = withActionErrors(async () => ({ status: 'pending' as const }));
		const event = fakeEvent(new FormData());
		// Calling with the event must typecheck.
		const result = await wrapped(event);
		if (result && 'status' in result) {
			// Narrowed: success path
			expect(result.status).toBe('pending');
		} else {
			expect.fail('expected success path');
		}
	});

	it('converts thrown API errors into fail(422, getHTTPErrors(e))', async () => {
		const handler = async () => {
			throw new Error('boom');
		};
		const wrapped = withActionErrors(handler);

		const result = await wrapped(fakeEvent(formDataFrom({})));

		expect(result).toMatchObject({
			status: 422,
			data: { errors: [{ id: 'form', title: 'An unexpected error occurred' }] },
		});
	});

	it('lets redirects thrown by the handler pass through', async () => {
		const handler = async () => {
			throw redirect(303, '/vehicles');
		};
		const wrapped = withActionErrors(handler);

		try {
			await wrapped(fakeEvent(formDataFrom({})));
			expect.fail('expected redirect to be thrown');
		} catch (e) {
			expect(isRedirect(e)).toBe(true);
		}
	});

	it('propagates fail(400) responses returned by the handler (no error conversion)', async () => {
		const handler = async () => fail(400, { errors: [{ id: 'email', title: 'Email is required' }] });
		const wrapped = withActionErrors(handler);

		const result = await wrapped(fakeEvent(formDataFrom({})));

		expect(result).toMatchObject({
			status: 400,
			data: { errors: [{ id: 'email', title: 'Email is required' }] },
		});
	});
});
