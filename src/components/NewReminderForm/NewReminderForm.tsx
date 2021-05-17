import { CheckCircleIcon } from '@chakra-ui/icons';
import {
    Button, FormControl, FormLabel, Heading, Input, Select, VStack, Text, FormHelperText, NumberInput, NumberInputField,
} from '@chakra-ui/react';
import DatePicker from 'components/DatePicker';
import FormErrors from 'components/FormErrors';
import SubmitButton from 'components/SubmitButton';
import { addMonths } from 'date-fns';
import useFormData from 'hooks/useFormData';
import useMutation, { mutate } from 'hooks/useMutation';
import { clientAPI } from 'queries/config';
import * as reminders from 'queries/reminders';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React, { useEffect, useState } from 'react';
import { formatDateISO, intlFormatDate, parseDateISO } from 'utils/date';
import { formatMileage } from 'utils/vehicle';

export interface NewReminderFormProps {
    vehicle: Vehicle;
    minMileage: number | undefined;
}

export const NewReminderForm: React.FC<NewReminderFormProps> = ({ vehicle, minMileage }) => {
    const [estimatedDate, setEstimatedDate] = useState<Date | null>(null);

    const { formData, getFormFieldProps, setFormField } = useFormData({
        date: addMonths(new Date(), 6),
        notes: '',
        reminderType: '',
        mileage: '',
    }, (fieldName, fieldValue) => {
        if (fieldName === 'mileage') {
            return fieldValue.replace(/\D/g, '');
        }
        return fieldValue;
    });

    const {
        mutate: createReminderMutation, isProcessing, isComplete, error,
    } = useMutation(reminders.createReminder, {
        onSuccess() {
            mutate(vehiclePath(vehicle.id));
        },
    });

    useEffect(() => {
        const estimateReminderDate = async (params: reminders.EstimateReminderParams) => {
            try {
                const { reminderDate } = await reminders.estimateReminderDate(clientAPI, vehicle.id, params);
                setEstimatedDate(parseDateISO(reminderDate));
            } catch (err) {
                console.error(err);
            }
        };

        const mileage = Number(formData.mileage);

        if (mileage >= (minMileage ?? 0)) {
            estimateReminderDate({
                mileage,
                date: formatDateISO(formData.date),
                reminderType: formData.reminderType as reminders.ReminderType,
            });
        } else {
            setEstimatedDate(null);
        }
    }, [minMileage, formData.mileage, formData.date, formData.reminderType]);

    const handleSubmit = (e) => {
        e.preventDefault();

        createReminderMutation(vehicle.id, {
            ...formData,
            date: formatDateISO(formData.date),
        });
    };

    if (isComplete && !error) {
        return (
            <VStack spacing={6}>
                <CheckCircleIcon boxSize={12} color="green" />
                <Heading>
                    Reminder Added
                </Heading>
            </VStack>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && 'errors' in error && (
                <FormErrors errors={error.errors} />
            )}

            <FormControl mb={4} id="note" isRequired>
                <FormLabel>Note</FormLabel>
                <Input type="text" {...getFormFieldProps('notes')} autoFocus />
            </FormControl>

            <FormControl mb={4} id="reminderType">
                <FormLabel>Remind me</FormLabel>
                <Select {...getFormFieldProps('reminderType')}>
                    <option value="">Don&apos;t remind me</option>
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
                    <NumberInput min={minMileage} clampValueOnBlur={false} keepWithinRange={false}>
                        <NumberInputField {...getFormFieldProps('mileage')} />
                    </NumberInput>
                    {minMileage && (
                        <FormHelperText>
                            Minimum
                            {' '}
                            {formatMileage(minMileage, vehicle.distanceUnit)}
                        </FormHelperText>
                    )}
                </FormControl>
            )}

            {estimatedDate && ['date_or_mileage', 'mileage'].includes(formData.reminderType) && (
                <Text mb={4}>
                    Estimated for
                    {' '}
                    {intlFormatDate(estimatedDate)}
                </Text>
            )}

            <SubmitButton isProcessing={isProcessing} />
        </form>
    );
};

export default NewReminderForm;
