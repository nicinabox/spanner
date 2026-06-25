import { describe, it, expect } from 'vitest';
import { decode } from './form';

describe('decode', () => {
	it('parses flat keys', () => {
		const fd = new FormData();
		fd.append('date', '2024-01-15');
		fd.append('notes', 'oil change');

		const result = decode(fd);
		expect(result).toEqual({ date: '2024-01-15', notes: 'oil change' });
	});

	it('parses nested keys with dot notation', () => {
		const fd = new FormData();
		fd.append('preferences.enableCost', 'true');

		const result = decode(fd);
		expect(result).toEqual({ preferences: { enableCost: true } });
	});

	it('parses nested keys with bracket notation (Rails style)', () => {
		const fd = new FormData();
		fd.append('record[date]', '2024-01-15');
		fd.append('record[notes]', 'oil change');

		const result = decode(fd);
		expect(result).toEqual({ record: { date: '2024-01-15', notes: 'oil change' } });
	});

	it('coerces numeric values', () => {
		const fd = new FormData();
		fd.append('mileage', '12345');

		const result = decode(fd);
		expect(result).toEqual({ mileage: 12345 });
	});

	it('coerces boolean values', () => {
		const fd = new FormData();
		fd.append('active', 'on');
		fd.append('enabled', 'false');

		const result = decode(fd);
		expect(result).toEqual({ active: true, enabled: false });
	});

	it('applies schema for boolean defaults', () => {
		const fd = new FormData();
		fd.append('name', 'test');

		const result = decode(fd, {
			name: 'string',
			'preferences.notify': 'boolean'
		});
		expect(result).toEqual({
			name: 'test',
			preferences: { notify: false }
		});
	});
});
