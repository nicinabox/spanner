import {
    FormControl, FormLabel, Input, FormHelperText, Button, Box, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
} from '@chakra-ui/react';
import FormErrors from 'components/FormErrors';
import useFormData from 'hooks/useFormData';
import useMutation from 'hooks/useMutation';
import { useRouter } from 'next/router';
import {
    createVehicle, destroyVehicle, updateVehicle, Vehicle,
} from 'queries/vehicles';
import React, { useRef, useState } from 'react';

export interface VehicleFormProps {
    vehicle?: Vehicle;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle }) => {
    const router = useRouter();
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const cancelDeleteRef = useRef();

    const onClose = () => setIsConfirmDeleteOpen(false);

    const { formData, getFormFieldProps } = useFormData({
        name: vehicle?.name ?? '',
        vin: vehicle?.vin ?? '',
        enableCost: vehicle?.enableCost ?? true,
    });

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
                                    {vehicle.name}
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
