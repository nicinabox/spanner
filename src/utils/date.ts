import { formatISO, intlFormat } from 'date-fns';

export const formatDateISO = (date: Date) => formatISO(date, { representation: 'date' });

export const parseDateUTC = (value: string) => {
    const date = new Date(value);
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
