import { formatNumber } from './number';

const toNumber = (v: string | number) => {
    return Number(String(v).replace(/\D/g, ''));
};

export const formatMileageValue = (v: string | number) => (v ? formatNumber(toNumber(v)) : '');

export const parseMileageValue = (v: string) => toNumber(v);

export const formatCostValue = (v: string | number) => (v ? formatNumber(toNumber(v)) : '');

export const parseCostValue = (v: string) => toNumber(v);

export const mileageFieldHelpers = {
    formatValue: formatMileageValue,
    parseValue: parseMileageValue,
};

export const costFieldHelpers = {
    formatValue: formatCostValue,
    parseValue: parseCostValue,
};
