import { formatISO } from 'date-fns';

export const formatDateISO = (date: Date) => formatISO(date, { representation: 'date' });
