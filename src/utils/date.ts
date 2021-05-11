import { formatISO, parseISO } from 'date-fns';

export const formatDateISO = (date: Date) => formatISO(date, { representation: 'date' });

export const parseDateISO = (value: string) => {
    const date = new Date(value);
    const tzOffset = date.getTimezoneOffset() / 60;
    date.setHours(date.getHours() + tzOffset);
    return date;
}