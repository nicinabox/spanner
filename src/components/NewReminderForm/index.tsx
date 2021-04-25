import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, CloseButton, FormControl, FormLabel, Heading, Input, Select, VStack } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import DatePicker from 'components/DatePicker';
import { addMonths } from 'date-fns';
import useFormData from 'hooks/useFormData';
import { APIError, mutate, useMutation } from 'hooks/useRequest';
import { createReminder } from 'queries/reminders';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { formatDateISO } from 'utils/date';
import FormErrors from 'components/FormErrors';

export interface NewReminderFormProps {
    vehicle: Vehicle;
}

export const NewReminderForm: React.FC<NewReminderFormProps> = ({ vehicle }) => {
    const { formData, getFormFieldProps, setFormField } = useFormData({
        date: addMonths(new Date(), 6),
        notes: '',
        reminderType: '',
        mileage: '',
    });

    const { mutate: createReminderMutation, isProcessing, isComplete, error } = useMutation(createReminder);

    const handleSubmit = (e) => {
        e.preventDefault();

        createReminderMutation(vehicle.id, {
            ...formData,
            date: formatDateISO(formData.date),
        }, {
            onSuccess() {
                mutate(vehiclePath(vehicle.id));
            }
        });
    }

    if (isComplete && !error) {
        return (
            <VStack spacing={6}>
                <CheckCircleIcon boxSize={12} color="green" />
                <Heading>
                    Reminder Added
                </Heading>
            </VStack>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && 'errors' in error && (
                <FormErrors errors={error.errors} />
            )}

            <FormControl mb={4} id="note" isRequired>
                <FormLabel>Note</FormLabel>
                <Input type="text" {...getFormFieldProps('notes')} />
            </FormControl>

            <FormControl mb={4} id="reminderType">
                <FormLabel>Remind me</FormLabel>
                <Select {...getFormFieldProps('reminderType')}>
                    <option value="">Don't remind me</option>
                    <option value="date_or_mileage">On a date or mileage, whichever is first</option>
                    <option value="date">On a date</option>
                    <option value="mileage">At a mileage</option>
                </Select>
            </FormControl>

            {['date', 'date_or_mileage'].includes(formData.reminderType) && (
                <FormControl mb={4} id="date" isRequired>
                    <FormLabel>Date</FormLabel>
                    <input type="hidden" {...getFormFieldProps('date')} />
                    <DatePicker initialDate={formData.date} onChange={(date) => setFormField('date', date)} />
                </FormControl>
            )}

            {['mileage', 'date_or_mileage'].includes(formData.reminderType) && (
                <FormControl mb={4} id="mileage" isRequired>
                    <FormLabel>Mileage</FormLabel>
                    <Input type="text" {...getFormFieldProps('mileage')} />
                </FormControl>
            )}

            <Button type="submit" colorScheme="brand" disabled={isProcessing} isLoading={isProcessing}>
                Save
            </Button>
        </form>
    );
};

export default NewReminderForm;
