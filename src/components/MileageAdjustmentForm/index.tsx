import { FormControl, FormLabel, Input, FormHelperText, Button } from '@chakra-ui/react';
import { format } from 'date-fns';
import useFormData from 'hooks/useFormData';
import { clientAPI } from 'queries/config';
import { createRecord } from 'queries/records';
import { fetchVehicle, Vehicle } from 'queries/vehicles';
import React, { useState } from 'react';
import { formatNumber } from 'utils/number';

export interface MileageAdjustmentFormProps {
    vehicle: Vehicle;
}

export const MileageAdjustmentForm: React.FC<MileageAdjustmentFormProps> = ({ vehicle }) => {
    const { formData, getFormFieldProps } = useFormData({
        mileage: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createRecord(clientAPI, vehicle.id, {
                date: format(new Date(), 'yyyy-MM-dd'),
                notes: 'Milege adjustment',
                mileage: Number(formData.mileage),
                recordType: 'mileage adjustment',
            })
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <FormControl mb={4} id="mileage" isRequired>
                <FormLabel>Enter your current mileage</FormLabel>
                <Input type="number" {...getFormFieldProps('mileage')} autoFocus />
                <FormHelperText>Estimated mileage is {formatNumber(vehicle.estimatedMileage)}</FormHelperText>
            </FormControl>

            <Button type="submit" colorScheme="brand">
                Save
            </Button>
        </form>
    );
};

export default MileageAdjustmentForm;
