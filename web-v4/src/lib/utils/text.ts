const pluralRules = new Intl.PluralRules('en-US');

export function pluralize(text: string | [string, string], count: number) {
	const [singular, plural] = Array.isArray(text) ? text : [text, text + 's'];
	if (pluralRules.select(count) === 'one') return singular;
	return plural;
}

export function parameterize(text: string, sep = '-'): string {
	return text.toLowerCase().replace(/[\W]+/g, sep);
}
