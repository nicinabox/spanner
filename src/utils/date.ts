import { formatISO, intlFormat } from 'date-fns';

export function getTime(date: string) {
    return new Date(date).getTime();
}

// '2019-09-18'
export const formatDateISO = (date: Date): string => formatISO(date, { representation: 'date' });

// 'Jan 1, 2021' UTC
export const intlFormatDateUTC = (date: string, formatOptions = {}): string => {
    return intlFormatDate(parseDateUTC(date), formatOptions);
};

// 'Jan 1, 2021'
export const intlFormatDate = (date: Date, formatOptions = {}): string => {
    return intlFormat(date, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        ...formatOptions,
    });
};

export const parseDateUTC = (value: string | Date): Date => {
    const date = value instanceof Date ? value : new Date(value);
    const tzOffset = date.getTimezoneOffset() / 60;
    date.setHours(date.getHours() + tzOffset);
    return date;
};
