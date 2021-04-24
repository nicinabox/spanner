import { formatISO } from "date-fns";

export const formatDateISO = (date: Date) => {
    return formatISO(date, { representation: 'date' });
};
