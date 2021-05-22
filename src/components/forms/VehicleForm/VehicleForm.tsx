import {
    Box, Checkbox, FormControl, FormHelperText, FormLabel, Input, Radio, RadioGroup, Stack,
} from '@chakra-ui/react';
import DestroyButton from 'components/common/DestroyButton';
import FormErrors from 'components/common/FormErrors';
import SubmitButton from 'components/common/SubmitButton';
import useFormData from 'hooks/useFormData';
import useMutation from 'hooks/useMutation';
import { useRouter } from 'next/router';
import * as vehicles from 'queries/vehicles';
import React, { useEffect } from 'react';
import { vehiclePath, vehiclesPath } from 'utils/resources';

export interface VehicleFormProps {
    vehicle?: vehicles.Vehicle;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle }) => {
    const router = useRouter();

    const { formData, getFormFieldProps, setFormData } = useFormData({
        name: '',
        vin: '',
        enableCost: true,
        distanceUnit: 'mi',
        ...vehicle,
    }, [vehicle]);

    useEffect(() => {
        if (vehicle) setFormData({ ...vehicle });
    }, [vehicle]);

    const { mutate: createOrUpdateVehicle, isProcessing, error } = useMutation(vehicles.createOrUpdateVehicle, {
        onSuccess(nextVehicle) {
            router.replace(vehiclePath(nextVehicle.id));
        },
    });

    const { mutate: destroyVehicle } = useMutation(vehicles.destroyVehicle, {
        onSuccess() {
            router.replace(vehiclesPath());
        },
    });

    const handleDeleteVehicle = (e) => {
        e.preventDefault();
        if (!vehicle) return;
        destroyVehicle(vehicle.id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createOrUpdateVehicle(formData);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {error && 'errors' in error && (
                    <FormErrors errors={error.errors} />
                )}

                <FormControl id="name" mb={4} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" {...getFormFieldProps('name')} />
                </FormControl>

                <FormControl id="name" mb={4}>
                    <FormLabel>VIN</FormLabel>
                    <Input type="text" {...getFormFieldProps('vin')} />
                    <FormHelperText>VIN is optional but recommended</FormHelperText>
                </FormControl>

                <FormControl id="name" mb={4}>
                    <FormLabel>Distance Unit</FormLabel>
                    <RadioGroup {...getFormFieldProps('distanceUnit')}>
                        <Stack direction="row">
                            <Radio value="mi">miles</Radio>
                            <Radio value="km">kilometers</Radio>
                            <Radio value="hr">hours</Radio>
                        </Stack>
                    </RadioGroup>
                </FormControl>

                <FormControl display="flex" alignItems="center" mb={4}>
                    <Checkbox {...getFormFieldProps('enableCost')}>
                        Enable Cost
                    </Checkbox>
                </FormControl>

                <SubmitButton isProcessing={isProcessing} />
            </form>

            {Boolean(vehicle) && (
                <Box mt={10}>
                    <DestroyButton
                        onConfirm={handleDeleteVehicle}
                    >
                        Delete vehicle
                    </DestroyButton>
                </Box>
            )}
        </>
    );
};

export default VehicleForm;
