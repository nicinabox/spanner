// TODO handle locale currency

export function formatNumber(number: number, locale = 'en-US') {
    return new Intl.NumberFormat(locale, { maximumSignificantDigits: 6 }).format(number);
}

export function formatCurrency(number: number, locale = 'en-US') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(number);
}

export function getCurrencySymbol(currency = 'USD', locale = 'en-US') {
    return (0).toLocaleString(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).replace(/\d/g, '').trim();
}
