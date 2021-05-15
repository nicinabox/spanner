import { useState } from 'react';

const transformNullValues = <T extends Record<string, unknown>>(data: T) => {
    return Object.keys(data).reduce<Record<string, unknown>>((acc, key) => {
        return { ...acc, [key]: data[key] ?? '' };
    }, {});
};

export default function useFormData<T extends Record<string, unknown>>(initialData: T, transformValue?: (fieldName: string, fieldValue: string) => string) {
    const [formData, setFormData] = useState(transformNullValues(initialData) as T);

    const getInputValue = ({ target }) => {
        return target.type === 'checkbox' ? target.checked : target.value;
    };

    const handleFieldChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: transformValue?.(name, value) ?? value,
        });
    };

    const getFormFieldProps = (name: string, handleGetValue = getInputValue) => {
        const valueField = typeof formData[name] === 'boolean' ? 'isChecked' : 'value';

        return {
            name,
            [valueField]: formData[name],
            onChange: (v) => {
                handleFieldChange(name, handleGetValue(v));
            },
        };
    };

    const setFormField = (name: string, value: any) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return {
        getFormFieldProps,
        setFormField,
        setFormData,
        formData,
    };
}
