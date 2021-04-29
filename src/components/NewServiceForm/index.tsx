import {
    Box, Button, FormControl, FormLabel, Heading, HStack, Input, Textarea, VStack,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import DatePicker from 'components/DatePicker';
import useFormData from 'hooks/useFormData';
import { useMutation } from 'hooks/useRequest';
import { createRecord } from 'queries/records';
import { Vehicle } from 'queries/vehicles';
import { formatDateISO } from 'utils/date';
import React from 'react';
import FormErrors from 'components/FormErrors';

export interface NewServiceFormProps {
    vehicle: Vehicle;
}

export const NewServiceForm: React.FC<NewServiceFormProps> = ({ vehicle }) => {
    const { formData, getFormFieldProps, setFormField } = useFormData({
        date: new Date(),
        notes: '',
        mileage: vehicle.estimatedMileage,
        cost: '',
    });

    const {
        mutate: mutateVehicleRecord, isProcessing, isComplete, error,
    } = useMutation(createRecord);

    const handleSubmit = (e) => {
        e.preventDefault();

        mutateVehicleRecord(vehicle.id, {
            ...formData,
            date: formatDateISO(formData.date),
        });
    };

    if (isComplete) {
        return (
            <VStack spacing={6}>
                <CheckCircleIcon boxSize={12} color="green" />
                <Heading>
                    Service Added
                </Heading>
            </VStack>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && 'errors' in error && (
                <FormErrors errors={error.errors} />
            )}

            <HStack spacing={8}>
                <Box>
                    <FormControl mb={4} id="date" isRequired>
                        <FormLabel>Date</FormLabel>

                        <input type="hidden" {...getFormFieldProps('date')} />
                        <DatePicker onChange={(date) => setFormField('date', date)} initialDate={formData.date} />
                    </FormControl>
                </Box>
                <Box flex={1}>
                    <FormControl mb={4} id="Notes" isRequired>
                        <FormLabel>Notes</FormLabel>
                        <Textarea {...getFormFieldProps('notes')} />
                    </FormControl>
                    <FormControl mb={4} id="mileage" isRequired>
                        <FormLabel>Mileage</FormLabel>
                        <Input type="number" {...getFormFieldProps('mileage')} />
                    </FormControl>
                    <FormControl mb={4} id="cost">
                        <FormLabel>Cost</FormLabel>
                        <Input type="number" {...getFormFieldProps('cost')} />
                    </FormControl>
                </Box>
            </HStack>

            <Button type="submit" colorScheme="brand" disabled={isProcessing} isLoading={isProcessing}>
                Save
            </Button>
        </form>
    );
};

export default NewServiceForm;
