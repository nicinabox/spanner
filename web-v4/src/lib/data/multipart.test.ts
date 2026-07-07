import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$app/env/private', () => ({
	API_URL: 'http://api.test',
}));

import { uploadRecord, deleteAttachment, toMultipartFormData } from './multipart';

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

describe('toMultipartFormData', () => {
	it('wraps keys with prefix', () => {
		const fd = toMultipartFormData({ date: '2024-01-15', notes: 'test' }, { prefix: 'record' });
		expect(fd.get('record[date]')).toBe('2024-01-15');
		expect(fd.get('record[notes]')).toBe('test');
	});

	it('skips null and undefined values', () => {
		const fd = toMultipartFormData({ a: 'keep', b: null, c: undefined }, { prefix: 'r' });
		expect(fd.get('r[a]')).toBe('keep');
		expect(fd.get('r[b]')).toBeNull();
		expect(fd.get('r[c]')).toBeNull();
	});

	it('appends array values as separate entries', () => {
		const fd = toMultipartFormData(
			{ classificationIds: [1, 2, 3] },
			{ prefix: 'record' },
		);
		expect(fd.getAll('record[classificationIds]')).toEqual(['1', '2', '3']);
	});

	it('getAll works after decode iterates FormData', () => {
		const fd = new FormData();
		fd.append('record[classification_ids][]', '1');
		fd.append('record[classification_ids][]', '3');
		fd.append('record[date]', '2024-01-15');

		// Simulate decode iterating all entries
		for (const _ of fd.entries()) {
			// consume iterator
		}

		const ids = fd.getAll('record[classification_ids][]');
		expect(ids).toEqual(['1', '3']);
	});

	it('reads classification_ids before decode to be safe', () => {
		const fd = new FormData();
		fd.append('record[classification_ids][]', '1');
		fd.append('record[classification_ids][]', '3');
		fd.append('record[date]', '2024-01-15');

		// Read before decode (the fix)
		const ids = fd.getAll('record[classification_ids][]');

		// Simulate decode iterating all entries
		for (const _ of fd.entries()) {
			// consume iterator
		}

		const body = toMultipartFormData({ date: '2024-01-15' }, { prefix: 'record' });
		for (const id of ids) {
			body.append('record[classification_ids][]', id);
		}

		expect(body.getAll('record[classification_ids][]')).toEqual(['1', '3']);
		expect(body.get('record[date]')).toBe('2024-01-15');
	});

	it('handles empty classification_ids', () => {
		const incoming = new FormData();
		incoming.append('record[classification_ids][]', '');

		const ids = incoming.getAll('record[classification_ids][]');
		const body = new FormData();
		for (const id of ids) {
			body.append('record[classification_ids][]', id);
		}

		expect(body.getAll('record[classification_ids][]')).toEqual(['']);
	});
});
