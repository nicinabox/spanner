import React from 'react';
import {
    Button, FormControl, FormHelperText, FormLabel, Input, VStack, Heading,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import useFormData from 'hooks/useFormData';
import useMutation, { mutate } from 'hooks/useMutation';
import { createRecord } from 'queries/records';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import { formatEstimatedMileage } from 'utils/vehicle';
import FormErrors from 'components/FormErrors';
import SubmitButton from 'components/SubmitButton';
import { useRouter } from 'next/router';

export interface MileageAdjustmentFormProps {
    vehicle: Vehicle;
}

export const MileageAdjustmentForm: React.FC<MileageAdjustmentFormProps> = ({ vehicle }) => {
    const router = useRouter();

    const {
        mutate: mutateVehicleRecord, isProcessing, error,
    } = useMutation(createRecord, {
        onSuccess() {
            mutate(vehiclePath(vehicle.id));
            router.push(`/vehicles/${vehicle.id}`);
        },
    });

    const { formData, getFormFieldProps } = useFormData({
        mileage: '',
    }, (fieldName, fieldValue) => {
        if (fieldName === 'mileage') {
            return fieldValue.replace(/\D/g, '');
        }
        return fieldValue;
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        mutateVehicleRecord(vehicle.id, {
            date: format(new Date(), 'yyyy-MM-dd'),
            notes: 'Mileage adjustment',
            mileage: formData.mileage,
            recordType: 'mileage adjustment',
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && 'errors' in error && (
                <FormErrors errors={error.errors} />
            )}

            <FormControl mb={4} id="mileage" isRequired>
                <FormLabel>Enter your current mileage</FormLabel>
                <Input {...getFormFieldProps('mileage')} autoFocus />
                <FormHelperText>
                    Your estimated mileage is
                    {' '}
                    {formatEstimatedMileage(vehicle)}
                </FormHelperText>
            </FormControl>

            <SubmitButton isProcessing={isProcessing} />

        </form>
    );
};

export default MileageAdjustmentForm;
