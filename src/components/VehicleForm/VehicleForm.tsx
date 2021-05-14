import {
    FormControl, FormLabel, Input, FormHelperText, Button, Box, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Select, Radio, RadioGroup, Stack, Switch, Checkbox,
} from '@chakra-ui/react';
import FormErrors from 'components/FormErrors';
import SubmitButton from 'components/SubmitButton';
import useFormData from 'hooks/useFormData';
import useMutation from 'hooks/useMutation';
import { useRouter } from 'next/router';
import {
    createVehicle, destroyVehicle, updateVehicle, Vehicle,
} from 'queries/vehicles';
import React, { useEffect, useRef, useState } from 'react';

export interface VehicleFormProps {
    vehicle?: Vehicle;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle }) => {
    const router = useRouter();
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const cancelDeleteRef = useRef<HTMLButtonElement>(null);

    const onClose = () => setIsConfirmDeleteOpen(false);

    const { formData, getFormFieldProps, setFormData } = useFormData({
        name: vehicle?.name ?? '',
        vin: vehicle?.vin ?? '',
        enableCost: vehicle?.enableCost ?? true,
        distanceUnit: vehicle?.distanceUnit ?? 'mi',
    });

    useEffect(() => {
        if (vehicle) setFormData({ ...vehicle });
    }, [vehicle]);

    const { mutate: createOrUpdateVehicle, isProcessing, error } = useMutation((api, params) => {
        if (vehicle) {
            return updateVehicle(api, vehicle.id, params);
        }
        return createVehicle(api, params);
    }, {
        onSuccess(nextVehicle) {
            router.push(`/vehicles/${nextVehicle.id}`);
        },
    });

    const { mutate: destroyVehicleMutation } = useMutation(destroyVehicle, {
        onSuccess() {
            router.push('/vehicles');
        },
    });

    const handleDeleteVehicle = (e) => {
        e.preventDefault();
        if (!vehicle) return;
        destroyVehicleMutation(vehicle.id);
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
                    <RadioGroup {...getFormFieldProps('distanceUnit', (v) => v)}>
                        <Stack direction="row">
                            <Radio value="mi">miles</Radio>
                            <Radio value="km">kilometers</Radio>
                            <Radio value="hr">hours</Radio>
                        </Stack>
                    </RadioGroup>
                </FormControl>

                <FormControl display="flex" alignItems="center" mb={4}>
                    <Checkbox {...getFormFieldProps('enableCost')}>Enable Cost</Checkbox>
                </FormControl>

                <SubmitButton isProcessing={isProcessing} />
            </form>

            {Boolean(vehicle) && (
                <Box mt={10}>
                    <Button variant="outline" colorScheme="red" onClick={() => setIsConfirmDeleteOpen(true)}>
                        Delete vehicle
                    </Button>

                    <AlertDialog
                        isOpen={isConfirmDeleteOpen}
                        leastDestructiveRef={cancelDeleteRef}
                        onClose={onClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                    Delete &ldquo;
                                    {vehicle?.name}
                                    &rdquo;
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Are you sure? You can&apos;t undo this action afterwards.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelDeleteRef} onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button colorScheme="red" onClick={handleDeleteVehicle} ml={3}>
                                        Delete
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </Box>
            )}
        </>
    );
};

export default VehicleForm;
