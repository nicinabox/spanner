import { formatISO, intlFormat } from 'date-fns';

export function getTime(date: string) {
    return new Date(date).getTime();
}

export const formatDateISO = (date: Date) => formatISO(date, { representation: 'date' });

export const parseDateUTC = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    const tzOffset = date.getTimezoneOffset() / 60;
    date.setHours(date.getHours() + tzOffset);
    return date;
};

export const intlFormatDateUTC = (date: string, formatOptions = {}) => {
    return intlFormatDate(parseDateUTC(date), formatOptions);
};

export const intlFormatDate = (date: Date, formatOptions = {}) => {
    return intlFormat(date, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        ...formatOptions,
    });
};
