import { useState } from "react";

export default function useFormData<T>(initialData: T) {
    const [formData, setFormData] = useState(initialData);

    const handleInputChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    const getFormFieldProps = (name) => {
        return {
            name,
            value: formData[name],
            onChange: handleInputChange,
        }
    }

    return {
        handleInputChange,
        getFormFieldProps,
        formData,
    }
}
