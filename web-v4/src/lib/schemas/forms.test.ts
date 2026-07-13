import { describe, it, expect } from 'vitest';
import { parseForm } from '$lib/utils/schema';
import * as v from 'valibot';
import { booleanForm } from './forms';

const formDataFrom = (obj: Record<string, string>) => {
	const fd = new FormData();
	for (const [k, v] of Object.entries(obj)) fd.append(k, v);
	return fd;
};

const boolSchema = v.object({
	flag: booleanForm,
});

const nestedSchema = v.object({
	preferences: v.object({
		enableCost: booleanForm,
	}),
});

describe('booleanForm', () => {
	it('coerces "on" to true (checked checkbox)', () => {
		const parsed = parseForm(formDataFrom({ flag: 'on' }), boolSchema);
		expect(parsed.data?.flag).toBe(true);
	});

	it('coerces "off" to false (explicit unchecked)', () => {
		const parsed = parseForm(formDataFrom({ flag: 'off' }), boolSchema);
		expect(parsed.data?.flag).toBe(false);
	});

	it('defaults to false when the field is missing (unchecked checkbox)', () => {
		const parsed = parseForm(formDataFrom({}), boolSchema);
		expect(parsed.data?.flag).toBe(false);
	});

	it('passes through literal true', () => {
		const fd = new FormData();
		fd.append('flag', 'true');
		const parsed = parseForm(fd, boolSchema);
		expect(parsed.data?.flag).toBe(true);
	});

	it('parses nested checkbox values into a nested object', () => {
		// The form submits `preferences.enableCost=on` (one key, dot in the
		// name). A nested valibot schema should produce
		// `{ preferences: { enableCost: true } }`, NOT a flat object with a
		// literal dotted key.
		const parsed = parseForm(formDataFrom({ 'preferences.enableCost': 'on' }), nestedSchema);
		expect(parsed.data).toEqual({ preferences: { enableCost: true } });
	});
});
