import { describe, it, expect, vi, beforeEach } from 'vitest';

const consoleMocks: Record<string, ReturnType<typeof vi.fn>> = {
	error: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
	debug: vi.fn(),
};

vi.stubGlobal('console', { ...console, ...consoleMocks });
// Allow every level through the filter (default is info).
vi.stubEnv('LOG_LEVEL', 'debug');

const { logger } = await import('./logger');

const written = () =>
	Object.values(consoleMocks).flatMap((mock) => mock.mock.calls.map((call) => call[0]));

const writtenVia = (level: string) =>
	consoleMocks[level].mock.calls.map((call) => call[0]) as string[];

describe('logger', () => {
	beforeEach(() => {
		Object.values(consoleMocks).forEach((mock) => mock.mockReset());
	});

	it('emits structured JSON records with ts, level, msg', () => {
		logger.info('hello');
		const entry = JSON.parse(written()[0] as string);
		expect(entry.level).toBe('info');
		expect(entry.message).toBe('hello');
		expect(typeof entry.ts).toBe('string');
	});

	it('merges extra fields into the record', () => {
		logger.warn('boom', { path: '/x', status: 500 });
		const entry = JSON.parse(written()[0] as string);
		expect(entry.path).toBe('/x');
		expect(entry.status).toBe(500);
	});

	it('serializes Error fields instead of stringifying to {}', () => {
		logger.error('boom', { error: new Error('kaboom') });
		const entry = JSON.parse(written()[0] as string);
		expect(entry.error).toEqual({
			name: 'Error',
			message: 'kaboom',
		});
	});

	it('uses error.message as message when passed an Error', () => {
		logger.error(new Error('kaboom'));
		const entry = JSON.parse(writtenVia('error')[0] as string);
		expect(entry.message).toBe('kaboom');
	});

	it('routes error and warn through the console stderr methods', () => {
		logger.error('boom');
		logger.warn('careful');
		expect(consoleMocks.error).toHaveBeenCalledTimes(1);
		expect(consoleMocks.warn).toHaveBeenCalledTimes(1);
		expect(consoleMocks.info).not.toHaveBeenCalled();
	});

	it('routes info and debug through console stdout methods', () => {
		logger.info('hello');
		logger.debug('detail');
		expect(consoleMocks.info).toHaveBeenCalledTimes(1);
		expect(consoleMocks.debug).toHaveBeenCalledTimes(1);
		expect(consoleMocks.error).not.toHaveBeenCalled();
	});

	it('emits JSON on the routed console method', () => {
		logger.error('boom');
		const entry = JSON.parse(writtenVia('error')[0] as string);
		expect(entry.level).toBe('error');
		expect(entry.message).toBe('boom');
	});
});
