import { describe, expect, it, vi } from 'vitest';
import { execSync } from 'node:child_process';
import { formatVersion, getVersion } from './version';

vi.mock('node:child_process', () => ({
	execSync: vi.fn(),
}));

const mockedExecSync = vi.mocked(execSync);

describe('formatVersion', () => {
	it('formats year, week, and hash', () => {
		expect(formatVersion(2026, 28, 'abc1234')).toBe('v4.26.28.abc1234');
	});
});

describe('getVersion', () => {
	it('returns the exact git tag when on a tagged commit', () => {
		mockedExecSync.mockReturnValue('v4.2026.28.1\n');
		expect(getVersion()).toBe('v4.2026.28.1');
	});

	it('falls back to week + short hash when not on a tag', () => {
		mockedExecSync
			.mockImplementationOnce(() => {
				throw new Error('no exact tag');
			})
			.mockReturnValueOnce('abc1234\n');
		expect(getVersion()).toMatch(/^v4\.\d{2}\.\d{1,2}\.abc1234$/);
	});

	it('falls back to a date when git is unavailable', () => {
		mockedExecSync.mockImplementation(() => {
			throw new Error('not a git repo');
		});
		expect(getVersion()).toMatch(/^v4\.\d{4}\.\d{2}\.\d{2}$/);
	});
});
