import {
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
} from '@chakra-ui/react';
import FormErrors from 'components/common/FormErrors';
import FormButton from 'components/common/FormButton';
import { format } from 'date-fns';
import useFormData from 'hooks/useFormData';
import useMutation, { mutate } from 'hooks/useMutation';
import { useRouter } from 'next/router';
import { createRecord } from 'queries/records';
import { vehicleAPIPath } from 'queries/vehicles';
import React from 'react';
import { mileageFieldHelpers } from 'utils/form';
import lang from 'utils/lang';
import { vehiclePath } from 'utils/resources';
import { formatEstimatedMileage } from 'utils/vehicle';
import FormSection from 'components/common/FormSection';

export interface MileageAdjustmentFormProps {
    vehicle: API.Vehicle;
}

export const MileageAdjustmentForm: React.FC<MileageAdjustmentFormProps> = ({
    vehicle,
}) => {
    const router = useRouter();

    const {
        mutate: mutateVehicleRecord,
        isProcessing,
        error,
    } = useMutation(createRecord, {
        onSuccess() {
            mutate(vehicleAPIPath(vehicle.id));
            router.replace(vehiclePath(vehicle.id));
        },
    });

    const { formData, register } = useFormData({ mileage: '' });

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
            {error && 'errors' in error && <FormErrors errors={error.errors} />}

            <FormSection>
                <FormControl mb={4} id="mileage" isRequired>
                    <FormLabel>
                        Enter your current{' '}
                        {lang.mileageLabel[vehicle.distanceUnit]}
                    </FormLabel>
                    <Input
                        {...register('mileage', mileageFieldHelpers)}
                        inputMode="numeric"
                        pattern="[0-9,]*"
                        autoFocus
                    />
                    <FormHelperText>
                        Your estimated {lang.mileageLabel[vehicle.distanceUnit]}{' '}
                        is {formatEstimatedMileage(vehicle)}
                    </FormHelperText>
                </FormControl>
            </FormSection>

            <FormButton type="submit" isProcessing={isProcessing} />
        </form>
    );
};

export default MileageAdjustmentForm;
