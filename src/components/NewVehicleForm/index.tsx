import { FormControl, FormLabel, Input, FormHelperText, Button } from '@chakra-ui/react';
import FormErrors from 'components/FormErrors';
import useFormData from 'hooks/useFormData';
import { useMutation } from 'hooks/useRequest';
import { useRouter } from 'next/router';
import { createVehicle } from 'queries/vehicles';
import React from 'react';

export interface NewVehicleFormProps {
}

export const NewVehicleForm: React.FC<NewVehicleFormProps> = ({  }) => {
    const router = useRouter();

    const { formData, getFormFieldProps } = useFormData({
        name: '',
        vin: '',
        enableCost: true,
    });

    const { mutate: createVehicleMutation, isProcessing, error } = useMutation(createVehicle, {
        onSuccess(nextVehicle) {
            router.push(`/vehicles/${nextVehicle.id}`);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createVehicleMutation(formData);
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && 'errors' in error && (
                <FormErrors errors={error.errors} />
            )}

            <FormControl id="name" mb={4} isRequired>
                <FormLabel>Name</FormLabel>
                <Input type="string" {...getFormFieldProps('name')} />
            </FormControl>

            <FormControl id="name" mb={4}>
                <FormLabel>VIN</FormLabel>
                <Input type="string" {...getFormFieldProps('vin')} />
                <FormHelperText>VIN is optional but recommended</FormHelperText>
            </FormControl>

            <Button type="submit" colorScheme="brand" disabled={isProcessing} isLoading={isProcessing}>
                Save
            </Button>
        </form>
    );
};

export default NewVehicleForm;
