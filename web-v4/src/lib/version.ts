import { getISOWeek } from 'date-fns';
import { execSync } from 'node:child_process';

export function formatVersion(year: number, week: number, rev?: string): string {
    const base = `v4.${String(year).slice(-2)}.${week}`;
    if (rev) return `${base}.${rev}`;
    return base;
}

export function getVersion(commitSha?: string): string {
	try {
		const tag = execSync('git describe --tags --exact-match', { encoding: 'utf8' }).trim();
		if (tag) return tag;
	} catch {
		// not on a tagged commit — fall through
    }

    let sha = commitSha;
	const now = new Date();
	try {
		sha ??= execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
	} catch {
		// not a git checkout — fall through
    }

	return formatVersion(now.getFullYear(), getISOWeek(now), sha);
}
