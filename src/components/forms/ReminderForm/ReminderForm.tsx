import {
    Box,
    FormControl, FormHelperText, FormLabel, Input, Select, Text,
} from '@chakra-ui/react';
import DatePicker from 'components/common/DatePicker';
import DestroyButton from 'components/common/DestroyButton';
import FormErrors from 'components/common/FormErrors';
import SubmitButton from 'components/common/SubmitButton';
import { addMonths } from 'date-fns';
import useFormData from 'hooks/useFormData';
import useMutation, { mutate } from 'hooks/useMutation';
import { capitalize } from 'lodash';
import { useRouter } from 'next/router';
import { clientAPI, RecordID } from 'queries/config';
import * as reminders from 'queries/reminders';
import { DistanceUnit, vehicleAPIPath } from 'queries/vehicles';
import React, { useEffect, useState } from 'react';
import { formatDateISO, intlFormatDate, parseDateUTC } from 'utils/date';
import { mileageFieldHelpers } from 'utils/form';
import lang from 'utils/lang';
import { reminderPath, vehiclePath } from 'utils/resources';
import { formatMileage } from 'utils/vehicle';

export interface NewReminderFormProps {
    vehicleId: RecordID;
    minMileage: number | undefined;
    distanceUnit: DistanceUnit | undefined;
    formValues?: reminders.ReminderParams;
}

export const ReminderForm: React.FC<NewReminderFormProps> = ({
    formValues, vehicleId, minMileage = 0, distanceUnit = 'mi',
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
        mutate: createOrUpdateReminder, isProcessing, error,
    } = useMutation(reminders.createOrUpdateReminder, {
        onSuccess() {
            mutate(vehicleAPIPath(vehicleId));
            if (formValues?.id) {
                router.replace(`${reminderPath(vehicleId, formValues?.id)}`);
            } else {
                router.replace(`${vehiclePath(vehicleId)}#panel=1`);
            }
        },
    });

    const { mutate: destroyReminder } = useMutation(reminders.destroyReminder, {
        onSuccess() {
            router.replace(`${vehiclePath(vehicleId)}#panel=1`);
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

        if (mileage > 0 && mileage >= minMileage) {
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
        createOrUpdateReminder(vehicleId, formData);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        if (!formValues) return;
        destroyReminder(vehicleId, formValues.id);
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

                    <Input type="text" {...getFormFieldProps('mileage', mileageFieldHelpers)} />

                    {Boolean(minMileage) && (
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

            {Boolean(formValues?.id) && (
                <Box mt={10}>
                    <DestroyButton
                        confirmTitle="Please confirm delete"
                        confirmBody="You can't undo this action afterwards."
                        onConfirm={handleDelete}
                    >
                        Delete reminder
                    </DestroyButton>
                </Box>
            )}
        </form>
    );
};

export default ReminderForm;
