import {
    FormControl, FormHelperText, FormLabel, Input, NumberInput, NumberInputField, Select, Text,
} from '@chakra-ui/react';
import DatePicker from 'components/common/DatePicker';
import FormErrors from 'components/common/FormErrors';
import SubmitButton from 'components/common/SubmitButton';
import { addMonths } from 'date-fns';
import useFormData from 'hooks/useFormData';
import useMutation, { mutate } from 'hooks/useMutation';
import { capitalize } from 'lodash';
import { useRouter } from 'next/router';
import { clientAPI, RecordID } from 'queries/config';
import * as reminders from 'queries/reminders';
import { DistanceUnit, vehiclePath } from 'queries/vehicles';
import React, { useEffect, useState } from 'react';
import { formatDateISO, intlFormatDate, parseDateUTC } from 'utils/date';
import { mileageFieldHelpers } from 'utils/form';
import lang from 'utils/lang';
import { formatMileage } from 'utils/vehicle';

export interface NewReminderFormProps {
    vehicleId: RecordID;
    minMileage: number | undefined;
    distanceUnit: DistanceUnit | undefined;
    formValues?: Partial<reminders.VehicleReminderParams>;
}

export const ReminderForm: React.FC<NewReminderFormProps> = ({
    formValues, vehicleId, minMileage, distanceUnit = 'mi',
}) => {
    const router = useRouter();
    const [estimatedDate, setEstimatedDate] = useState<Date | null>(null);

    const { formData, getFormFieldProps, setFormField } = useFormData({
        date: formatDateISO(addMonths(new Date(), 6)),
        notes: '',
        reminderType: '',
        mileage: '',
        ...formValues,
    }, [formValues]);

    const {
        mutate: createReminderMutation, isProcessing, error,
    } = useMutation(reminders.createReminder, {
        onSuccess() {
            mutate(vehiclePath(vehicleId));
            router.push(`/vehicles/${vehicleId}#panel=1`);
        },
    });

    useEffect(() => {
        const estimateReminderDate = async (params: reminders.EstimateReminderParams) => {
            try {
                const { reminderDate } = await reminders.estimateReminderDate(clientAPI, vehicleId, params);
                setEstimatedDate(parseDateUTC(reminderDate));
            } catch (err) {
                console.error(err);
            }
        };

        const mileage = Number(formData.mileage);

        if (mileage >= (minMileage ?? 0)) {
            estimateReminderDate({
                mileage,
                date: formData.date,
                reminderType: formData.reminderType as reminders.ReminderType,
            });
        } else {
            setEstimatedDate(null);
        }
    }, [minMileage, formData.mileage, formData.date, formData.reminderType]);

    const handleSubmit = (e) => {
        e.preventDefault();
        createReminderMutation(vehicleId, formData);
    };

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
                    <DatePicker initialDate={parseDateUTC(formData.date)} onChange={(date) => setFormField('date', date)} />
                </FormControl>
            )}

            {['mileage', 'date_or_mileage'].includes(formData.reminderType) && (
                <FormControl mb={4} id="mileage" isRequired>
                    <FormLabel>{capitalize(lang.mileageLabel[distanceUnit])}</FormLabel>
                    <NumberInput min={minMileage} clampValueOnBlur={false} keepWithinRange={false}>
                        <NumberInputField {...getFormFieldProps('mileage', mileageFieldHelpers)} />
                    </NumberInput>
                    {minMileage && (
                        <FormHelperText>
                            Minimum
                            {' '}
                            {formatMileage(minMileage, distanceUnit)}
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

            {/* TODO: Destroy button */}
        </form>
    );
};

export default ReminderForm;
