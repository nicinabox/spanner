import { getISOWeek } from 'date-fns';
import { execSync } from 'node:child_process';

export function formatVersion(year: number, week: number, hash: string): string {
	return `v4.${year}.${week}.${hash}`;
}

export function getVersion(): string {
	try {
		const tag = execSync('git describe --tags --exact-match', { encoding: 'utf8' }).trim();
		if (tag) return tag;
	} catch {
		// not on a tagged commit — fall through
	}
	try {
		const now = new Date();
		const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
		return formatVersion(now.getFullYear(), getISOWeek(now), hash);
	} catch {
		// not a git checkout — fall through
	}
	return `v4.${new Date().toISOString().slice(0, 10).replaceAll('-', '.')}`;
}
