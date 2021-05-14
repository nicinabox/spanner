import { useState } from 'react';

export default function useFormData<T>(initialData: T) {
    const [formData, setFormData] = useState(initialData);

    const handleInputChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.type === 'checkbox' ? target.checked : target.value,
        });
    };

    const handleRadioGroupChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const getFormFieldProps = (name: string, type: 'input' | 'radioGroup' = 'input') => ({
        name,
        value: formData[name],
        onChange: type === 'radioGroup' ? (v: string) => handleRadioGroupChange(name, v) : handleInputChange,
    });

    const setFormField = (name: string, value: any) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return {
        handleInputChange,
        getFormFieldProps,
        setFormField,
        setFormData,
        formData,
    };
}
