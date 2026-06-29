import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$env/static/private', () => ({
	API_URL: 'http://api.test',
}));

import { uploadRecord, deleteAttachment } from './multipart';

describe('uploadRecord', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn());
	});

	it('POSTs FormData on create', async () => {
		const fetchMock = vi
			.mocked(fetch)
			.mockResolvedValue(new Response(JSON.stringify({ id: 1 }), { status: 201 }));
		const form = new FormData();
		form.append('date', '2024-01-15');
		const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
		form.append('record[attachments][]', file);

		await uploadRecord(42, undefined, form, { authToken: 'tok-123' });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('http://api.test/vehicles/42/records');
		expect(init?.method).toBe('POST');
		expect(init?.body).toBe(form);
		expect((init?.headers as Headers).get('Authorization')).toBe('Token tok-123');
	});

	it('PUTs FormData on edit', async () => {
		const fetchMock = vi
			.mocked(fetch)
			.mockResolvedValue(new Response(JSON.stringify({ id: 1 }), { status: 200 }));
		const form = new FormData();

		await uploadRecord(42, 7, form, { authToken: 'tok-123' });

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('http://api.test/vehicles/42/records/7');
		expect(init?.method).toBe('PUT');
	});

	it('throws on backend error with parsed body', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ error: 'too large' }), { status: 422 }),
		);
		const form = new FormData();

		await expect(uploadRecord(42, undefined, form, { authToken: 'tok' })).rejects.toThrow(
			'HTTP Error: 422',
		);
	});
});

describe('deleteAttachment', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn());
	});

	it('sends DELETE with auth header', async () => {
		const fetchMock = vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));
		await deleteAttachment(42, 7, 'signed-id-abc', { authToken: 'tok' });

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('http://api.test/vehicles/42/records/7/attachments/signed-id-abc');
		expect(init?.method).toBe('DELETE');
		expect((init?.headers as Headers).get('Authorization')).toBe('Token tok');
	});
});
