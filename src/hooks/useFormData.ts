import { useState } from 'react';

export default function useFormData<T>(initialData: T) {
    const [formData, setFormData] = useState(initialData);

    const handleInputChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const getFormFieldProps = (name) => ({
        name,
        value: formData[name],
        onChange: handleInputChange,
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
        formData,
    };
}
