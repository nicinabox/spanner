import {
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Radio,
    RadioGroup,
    Stack,
    StackDivider,
    Switch,
    useColorModeValue,
} from '@chakra-ui/react';
import DestroyButton from 'components/common/DestroyButton';
import FormErrors from 'components/common/FormErrors';
import FormButton from 'components/common/FormButton';
import VehicleColorIndicator from 'components/VehicleColorIndicator';
import useFormData from 'hooks/useFormData';
import useMutation from 'hooks/useMutation';
import { useRouter } from 'next/router';
import * as vehicles from 'queries/vehicles';
import React from 'react';
import { vehiclePath, vehiclesPath } from 'utils/resources';
import DangerZone from 'components/common/DangerZone';
import FormSection from 'components/common/FormSection';

export interface VehicleFormProps {
    vehicle?: API.Vehicle;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle }) => {
    const router = useRouter();
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const { formData, register } = useFormData(
        {
            name: '',
            vin: '',
            distanceUnit: 'mi',
            ...vehicle,
            preferences: {
                enableCost: true,
                sendReminderEmails: true,
                sendPromptForRecords: true,
                showMileageAdjustmentRecords: true,
                ...vehicle?.preferences,
            },
        },
        [vehicle],
    );

    const {
        mutate: createOrUpdateVehicle,
        isProcessing,
        error,
    } = useMutation(vehicles.createOrUpdateVehicle, {
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

                <FormSection>
                    <FormControl id="name" mb={4} isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input type="text" {...register('name')} />
                    </FormControl>

                    <FormControl id="vin" mb={4}>
                        <FormLabel>VIN</FormLabel>
                        <Input type="text" {...register('vin')} />
                        <FormHelperText>
                            VIN is optional but recommended
                        </FormHelperText>
                    </FormControl>

                    <FormControl id="edit-color" mb={4} overflow="hidden">
                        <FormLabel>
                            Color
                            <Box mt={2}>
                                <VehicleColorIndicator
                                    color={formData.color}
                                    size={10}
                                    borderWidth={3}
                                />
                            </Box>
                        </FormLabel>
                        <Box position="absolute" left="-100%">
                            <input
                                id="edit-color"
                                type="color"
                                {...register('color')}
                            />
                        </Box>
                    </FormControl>

                    <FormControl id="distanceUnit" mb={4} isRequired>
                        <FormLabel>Distance Unit</FormLabel>
                        <RadioGroup {...register('distanceUnit')}>
                            <Stack direction="row" spacing={4}>
                                <Radio value="mi">miles</Radio>
                                <Radio value="km">kilometers</Radio>
                                <Radio value="hr">hours</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </FormSection>

                <FormSection heading="Preferences">
                    <Stack
                        spacing={4}
                        divider={<StackDivider borderColor={borderColor} />}
                    >
                        <FormControl display="flex" alignItems="center">
                            <FormLabel
                                flex={1}
                                pr={4}
                                m={0}
                                htmlFor="preferences.enableCost"
                            >
                                Enable cost
                                <FormHelperText mt={0}>
                                    Show cost column in History and cost field
                                    in form.
                                </FormHelperText>
                            </FormLabel>
                            <Switch
                                colorScheme="green"
                                {...register('preferences.enableCost')}
                            />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                            <FormLabel
                                flex={1}
                                pr={4}
                                m={0}
                                htmlFor="preferences.sendReminderEmails"
                            >
                                Send reminder emails
                                <FormHelperText mt={0}>
                                    Receive an email for upcoming reminders 2
                                    weeks before and on the due date.
                                </FormHelperText>
                            </FormLabel>
                            <Switch
                                colorScheme="green"
                                {...register('preferences.sendReminderEmails')}
                            />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                            <FormLabel
                                flex={1}
                                pr={4}
                                m={0}
                                htmlFor="preferences.sendPromptForRecords"
                            >
                                Send prompt for records
                                <FormHelperText mt={0}>
                                    Receive an email asking if you recenty
                                    performed service based on your record
                                    history.
                                </FormHelperText>
                            </FormLabel>
                            <Switch
                                colorScheme="green"
                                {...register(
                                    'preferences.sendPromptForRecords',
                                )}
                            />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                            <FormLabel
                                flex={1}
                                pr={4}
                                m={0}
                                htmlFor="preferences.showMileageAdjustmentRecords"
                            >
                                Show mileage adjustment records
                                <FormHelperText mt={0}>
                                    Show mileage adjustment records in History.
                                </FormHelperText>
                            </FormLabel>
                            <Switch
                                colorScheme="green"
                                {...register(
                                    'preferences.showMileageAdjustmentRecords',
                                )}
                            />
                        </FormControl>
                    </Stack>
                </FormSection>

                <FormButton type="submit" isProcessing={isProcessing} />
            </form>

            {Boolean(vehicle) && (
                <DangerZone>
                    <DestroyButton onConfirm={handleDeleteVehicle}>
                        Delete vehicle
                    </DestroyButton>
                </DangerZone>
            )}
        </>
    );
};

export default VehicleForm;
