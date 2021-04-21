export function formatNumber(number: number, locale: string = 'en-US') {
    return new Intl.NumberFormat(locale, { maximumSignificantDigits: 3 }).format(number);
}
