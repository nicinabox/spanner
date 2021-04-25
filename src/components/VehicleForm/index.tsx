import { FormControl, FormLabel, Input, FormHelperText, Button } from '@chakra-ui/react';
import FormErrors from 'components/FormErrors';
import useFormData from 'hooks/useFormData';
import { useMutation } from 'hooks/useRequest';
import { useRouter } from 'next/router';
import { createVehicle, updateVehicle, Vehicle } from 'queries/vehicles';
import React, { useCallback } from 'react';

export interface VehicleFormProps {
    vehicle?: Vehicle;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle }) => {
    const router = useRouter();

    const { formData, getFormFieldProps } = useFormData({
        name: vehicle?.name ?? '',
        vin: vehicle?.vin ?? '',
        enableCost: vehicle?.enableCost ?? true,
    });

    const { mutate: createOrUpdateVehicle, isProcessing, error } = useMutation((api, params) => {
        if (vehicle) {
            updateVehicle(api, vehicle.id, params);
        }
        return createVehicle(api, params);
    }, {
        onSuccess(nextVehicle) {
            router.push(`/vehicles/${nextVehicle.id}`);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createOrUpdateVehicle(formData);
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

export default VehicleForm;
