import { readFileSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

const contentDir = join(process.cwd(), '_content');

export const getContentFile = (name: string) => {
    const fullPath = join(contentDir, name);
    return readFileSync(fullPath, 'utf8');
};

export const getHtmlFromMarkdown = (name: string) => {
    const content = getContentFile(name);
    return marked(content);
};
