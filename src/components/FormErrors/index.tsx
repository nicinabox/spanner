import { Alert, AlertIcon } from '@chakra-ui/react';
import React from 'react';

export interface APIError {
    id: string;
    title: string;
}

export interface FormErrorsProps {
    errors: APIError[] | undefined;
}

export const FormErrors: React.FC<FormErrorsProps> = ({ errors }) => {
    if (!errors) return null;

    return (
        <Alert status="error" mb={6}>
            <AlertIcon />
            {errors.map((apiError) => apiError.title)}
        </Alert>
    );
};

export default FormErrors;
