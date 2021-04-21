export function formatNumber(number: number, locale: string = 'en-US') {
    return new Intl.NumberFormat(locale, { maximumSignificantDigits: 6 }).format(number);
}

export function formatCurrency(number: number, locale: string = 'en-US') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(number);
}
