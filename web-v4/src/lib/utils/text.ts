const pluralRules = new Intl.PluralRules('en-US');

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
	const subject = pluralRules.select(count) === 'one' ? singular : plural;
	return `${count} ${subject}`;
}
