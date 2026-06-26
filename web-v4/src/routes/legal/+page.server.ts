import { readFileSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const filePath = join(process.cwd(), 'static', 'legal.md');
	const markdown = readFileSync(filePath, 'utf-8');
	const html = await marked(markdown);

	return { html };
};
