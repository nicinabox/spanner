import {
    identity, isPlainObject, merge, set, get,
} from 'lodash';
import { DependencyList, useEffect, useState } from 'react';

interface FieldHelpers {
    parseValue?: (value: any) => any;
    formatValue?: (value: any) => any;
    valueProp?: string;
}

const transformValues = <T extends Record<string, unknown>>(data: T) => {
    return Object.keys(data).reduce<Record<string, unknown>>((acc, key) => {
        const value = data[key];

        if (isPlainObject(value)) {
            return {
                ...acc,
                [key]: transformValues(value as Record<string, unknown>),
            };
        }

        return {
            ...acc,
            [key]: value ?? '',
        };
    }, {});
};

export default function useFormData<T extends Record<string, unknown>>(initialData: T, deps: DependencyList = []) {
    const [formData, setFormData] = useState(transformValues(initialData) as T);
    const [touchedData, setTouchedData] = useState<Partial<T>>({});

    useEffect(() => {
        setFormDataSafe(merge({}, initialData, touchedData));
    }, deps);

    const setFormDataSafe = (nextData: T) => {
        setFormData(transformValues(nextData) as T);
    };

    const getInputValue = (event) => {
        if (event.target) {
            const { target } = event;

            if (target.type === 'checkbox') {
                return target.checked;
            }

            if (target.type === 'file') {
                return target.files;
            }

            return target.value;
        }

        return event;
    };

    const register = (name: string, {
        parseValue = identity,
        formatValue = identity,
        valueProp,
    }: FieldHelpers = {}) => {
        const value = get(formData, name);
        const valueField = valueProp || typeof value === 'boolean' ? 'isChecked' : 'value';

        return {
            name,
            [valueField]: formatValue(value),
            onChange: (ev) => {
                setValue(name, parseValue(getInputValue(ev)));
            },
        };
    };

    const setValue = (name: string, value: any) => {
        const nextTouchedData = set({ ...touchedData }, name, value);
        const nextFormData = set({ ...formData }, name, value);

        setTouchedData(nextTouchedData);
        setFormDataSafe(nextFormData);
    };

    return {
        register,
        setValue,
        setFormData: setFormDataSafe,
        formData,
    };
}
