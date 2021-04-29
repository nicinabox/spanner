import React from 'react';
import {
    Button, FormControl, FormHelperText, FormLabel, Input, VStack, Heading,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import useFormData from 'hooks/useFormData';
import { mutate, useMutation } from 'hooks/useRequest';
import { createRecord } from 'queries/records';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import { formatEstimatedMileage } from 'utils/vehicle';
import FormErrors from 'components/FormErrors';

export interface MileageAdjustmentFormProps {
    vehicle: Vehicle;
}

export const MileageAdjustmentForm: React.FC<MileageAdjustmentFormProps> = ({ vehicle }) => {
    const {
        mutate: mutateVehicleRecord, isProcessing, isComplete, error,
    } = useMutation(createRecord);

    const { formData, getFormFieldProps } = useFormData({
        mileage: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        mutateVehicleRecord(vehicle.id, {
            date: format(new Date(), 'yyyy-MM-dd'),
            notes: 'Milege adjustment',
            mileage: Number(formData.mileage),
            recordType: 'mileage adjustment',
        }, {
            onSuccess() {
                mutate(vehiclePath(vehicle.id));
            },
        });
    };

    if (isComplete) {
        return (
            <VStack spacing={6}>
                <CheckCircleIcon boxSize={12} color="green" />
                <Heading>
                    Mileage updated to
                    {' '}
                    {formatEstimatedMileage(vehicle)}
                </Heading>
            </VStack>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && 'errors' in error && (
                <FormErrors errors={error.errors} />
            )}

            <FormControl mb={4} id="mileage" isRequired>
                <FormLabel>Enter your current mileage</FormLabel>
                <Input type="number" {...getFormFieldProps('mileage')} autoFocus />
                <FormHelperText>
                    Estimated mileage is
                    {formatEstimatedMileage(vehicle)}
                </FormHelperText>
            </FormControl>

            <Button type="submit" colorScheme="brand" disabled={isProcessing} isLoading={isProcessing}>
                Save
            </Button>
        </form>
    );
};

export default MileageAdjustmentForm;
