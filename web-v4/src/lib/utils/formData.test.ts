import { describe, it, expect, vi, beforeEach } from 'vitest';
import { decode, encode, validate } from './formData';
import * as v from 'valibot';

describe('decode', () => {
	it('handles simple flat keys', () => {
		const fd = new FormData();
		fd.append('date', '2024-01-15');
		fd.append('notes', 'Test notes');

		const result = decode(fd);

		expect(result).toEqual({
			date: '2024-01-15',
			notes: 'Test notes',
		});
	});

	it('handles nested rails-style keys', () => {
		const fd = new FormData();
		fd.append('record[date]', '2024-01-15');
		fd.append('record[notes]', 'Test notes');

		const result = decode(fd);

		expect(result).toEqual({
			record: {
				date: '2024-01-15',
				notes: 'Test notes',
			},
		});
	});

	it('handles array keys', () => {
		const fd = new FormData();
		fd.append('classificationIds[]', '1');
		fd.append('classificationIds[]', '2');
		fd.append('classificationIds[]', '3');

		const result = decode(fd);

		expect(result).toEqual({
			classificationIds: ['1', '2', '3'],
		});
	});

	it('collapses single-element string arrays to scalar', () => {
		const fd = new FormData();
		fd.append('tags[]', 'only-one');

		const result = decode(fd);

		// Arrays always return arrays
		expect(result).toEqual({
			tags: ['only-one'],
		});
	});

	it('handles nested arrays', () => {
		const fd = new FormData();
		fd.append('record[classificationIds][]', '1');
		fd.append('record[classificationIds][]', '2');

		const result = decode(fd);

		expect(result).toEqual({
			record: {
				classificationIds: ['1', '2'],
			},
		});
	});

	it('filters empty strings from arrays', () => {
		const fd = new FormData();
		fd.append('items[]', '');
		fd.append('items[]', 'valid');
		fd.append('items[]', '');

		const result = decode(fd);

		expect(result).toEqual({
			items: ['valid'],
		});
	});

	it('handles mixed nested and flat keys', () => {
		const fd = new FormData();
		fd.append('record[date]', '2024-01-15');
		fd.append('record[notes]', 'Test');
		fd.append('tags[]', 'a');
		fd.append('tags[]', 'b');

		const result = decode(fd);

		expect(result).toEqual({
			record: {
				date: '2024-01-15',
				notes: 'Test',
			},
			tags: ['a', 'b'],
		});
	});

	it('handles deeply nested keys', () => {
		const fd = new FormData();
		fd.append('record[metadata][year]', '2024');
		fd.append('record[metadata][month]', '01');

		const result = decode(fd);

		expect(result).toEqual({
			record: {
				metadata: {
					year: '2024',
					month: '01',
				},
			},
		});
	});
});

describe('encode', () => {
	it('handles simple flat data', () => {
		const result = encode({ date: '2024-01-15', notes: 'Test' });
		const entries = Array.from(result.entries());

		expect(entries).toContainEqual(['date', '2024-01-15']);
		expect(entries).toContainEqual(['notes', 'Test']);
	});

	it('handles nested objects', () => {
		const result = encode({ record: { date: '2024-01-15', notes: 'Test' } });
		const entries = Array.from(result.entries());

		expect(entries).toContainEqual(['record[date]', '2024-01-15']);
		expect(entries).toContainEqual(['record[notes]', 'Test']);
	});

	it('handles arrays with [] suffix', () => {
		const result = encode({ classificationIds: ['1', '2'] });
		const entries = Array.from(result.entries());

		expect(entries).toContainEqual(['classificationIds[]', '1']);
		expect(entries).toContainEqual(['classificationIds[]', '2']);
	});

	it('handles nested arrays', () => {
		const result = encode({ record: { classificationIds: ['1', '2'] } });
		const entries = Array.from(result.entries());

		expect(entries).toContainEqual(['record[classificationIds][]', '1']);
		expect(entries).toContainEqual(['record[classificationIds][]', '2']);
	});

	it('handles files', () => {
		const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
		const result = encode({ attachments: [file] });
		const entries = Array.from(result.entries());

		expect(entries).toContainEqual(['attachments[]', file]);
	});

	it('skips undefined and null values', () => {
		const result = encode({ a: undefined, b: null, c: 'valid' });
		const entries = Array.from(result.entries());

		expect(entries).toEqual([['c', 'valid']]);
	});

	it('handles deeply nested objects', () => {
		const result = encode({ record: { metadata: { year: '2024' } } });
		const entries = Array.from(result.entries());

		expect(entries).toContainEqual(['record[metadata][year]', '2024']);
	});
});

describe('validate', () => {
	const schema = v.object({
		date: v.pipe(v.string(), v.minLength(1)),
		notes: v.pipe(v.string(), v.minLength(1)),
	});

	it('returns parsed data on success', async () => {
		const result = await validate({ date: '2024-01-15', notes: 'Test' }, schema);

		expect(result).toEqual({
			data: { date: '2024-01-15', notes: 'Test' },
		});
	});

	it('returns errors on validation failure', async () => {
		const result = await validate({ date: '', notes: '' }, schema);

		expect(result).toEqual({
			errors: expect.arrayContaining([
				expect.objectContaining({ id: 'date', title: expect.any(String) }),
				expect.objectContaining({ id: 'notes', title: expect.any(String) }),
			]),
		});
	});

	it('handles optional fields', async () => {
		const schemaWithOptional = v.object({
			date: v.pipe(v.string(), v.minLength(1)),
			notes: v.optional(v.string()),
		});

		const result = await validate({ date: '2024-01-15' }, schemaWithOptional);

		expect(result).toEqual({
			data: { date: '2024-01-15' },
		});
	});

	it('handles nested schemas', async () => {
		const nestedSchema = v.object({
			record: v.object({
				date: v.pipe(v.string(), v.minLength(1)),
			}),
		});

		const result = await validate(
			{ record: { date: '2024-01-15' } },
			nestedSchema,
		);

		expect(result).toEqual({
			data: { record: { date: '2024-01-15' } },
		});
	});
});

describe('decode + encode roundtrip', () => {
	it('preserves nested data through decode then encode', () => {
		const fd = new FormData();
		fd.append('record[date]', '2024-01-15');
		fd.append('record[notes]', 'Test');
		fd.append('record[classificationIds][]', '1');
		fd.append('record[classificationIds][]', '2');

		const decoded = decode(fd);
		const encoded = encode(decoded);
		const entries = Array.from(encoded.entries());

		expect(entries).toContainEqual(['record[date]', '2024-01-15']);
		expect(entries).toContainEqual(['record[notes]', 'Test']);
		expect(entries).toContainEqual(['record[classificationIds][]', '1']);
		expect(entries).toContainEqual(['record[classificationIds][]', '2']);
	});

	it('preserves arrays through roundtrip', () => {
		const fd = new FormData();
		fd.append('tags[]', 'a');
		fd.append('tags[]', 'b');

		const decoded = decode(fd);
		const encoded = encode(decoded);
		const entries = Array.from(encoded.entries());

		expect(entries).toContainEqual(['tags[]', 'a']);
		expect(entries).toContainEqual(['tags[]', 'b']);
	});
});
