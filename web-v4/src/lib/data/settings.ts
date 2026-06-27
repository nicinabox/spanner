import { createAPIRequest, type RequestOpts } from './client';

const request = createAPIRequest();

// Public client — no auth headers for unsubscribe
const publicRequest = createAPIRequest({
	authHeaderValue: () => undefined,
});

export const requestEmailChange = (email: string, host: string, opts: RequestOpts) => {
	return request(`/user/email_change`, {
		...opts,
		method: 'POST',
		json: { user: { email }, host },
	});
};

export const deleteAccount = (opts: RequestOpts) => {
	return request(`/user`, { ...opts, method: 'DELETE' });
};

export const unsubscribe = (token: string) => {
	return publicRequest<{ message: string }>(`/unsubscribe/${token}`);
};
