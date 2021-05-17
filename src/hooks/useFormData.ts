import { identity } from 'lodash';
import { DependencyList, useEffect, useState } from 'react';

interface FieldHelpers {
    parseValue?: (value: any) => any;
    formatValue?: (value: any) => any;
}

const transformValues = <T extends Record<string, unknown>>(data: T) => {
    return Object.keys(data).reduce<Record<string, unknown>>((acc, key) => {
        return {
            ...acc,
            [key]: data[key] ?? '',
        };
    }, {});
};

export default function useFormData<T extends Record<string, unknown>>(initialData: T, deps: DependencyList = []) {
    const [formData, setFormData] = useState(transformValues(initialData) as T);
    const [touchedData, setTouchedData] = useState<Partial<T>>({});

    useEffect(() => {
        setFormDataSafe({ ...initialData, ...touchedData });
    }, deps);

    const setFormDataSafe = (nextData: T) => {
        setFormData(transformValues(nextData) as T);
    };

    const getInputValue = (event) => {
        if (event.target) {
            const { target } = event;
            return target.type === 'checkbox' ? target.checked : target.value;
        }
        return event;
    };

    const getFormFieldProps = (name: string, {
        parseValue = identity,
        formatValue = identity,
    }: FieldHelpers = {}) => {
        const value = formData[name];
        const valueField = typeof value === 'boolean' ? 'isChecked' : 'value';

        return {
            name,
            [valueField]: formatValue(value),
            onChange: (ev) => {
                setFormField(name, parseValue(getInputValue(ev)));
            },
        };
    };

    const setFormField = (name: string, value: any) => {
        setTouchedData({ ...touchedData, [name]: value });
        setFormDataSafe({ ...formData, [name]: value });
    };

    return {
        getFormFieldProps,
        setFormField,
        setFormData: setFormDataSafe,
        formData,
    };
}
