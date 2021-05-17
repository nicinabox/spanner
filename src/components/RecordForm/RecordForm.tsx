import {
    Box, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, InputRightAddon, SimpleGrid, Textarea,
} from '@chakra-ui/react';
import DatePicker from 'components/common/DatePicker';
import DestroyButton from 'components/DestroyButton';
import FormErrors from 'components/common/FormErrors';
import SubmitButton from 'components/common/SubmitButton';
import useFormData from 'hooks/useFormData';
import useMutation from 'hooks/useMutation';
import useTextareaResize from 'hooks/useTextareaResize';
import { useRouter } from 'next/router';
import * as records from 'queries/records';
import { Vehicle } from 'queries/vehicles';
import React from 'react';
import { formatDateISO, parseDateUTC } from 'utils/date';
import { mileageFieldHelpers, costFieldHelpers } from 'utils/form';
import { getCurrencySymbol } from 'utils/number';

export interface NewServiceFormProps {
    vehicle: Vehicle;
    record?: records.VehicleRecord;
}

export const NewServiceForm: React.FC<NewServiceFormProps> = ({ vehicle, record }) => {
    const router = useRouter();
    const textareaRef = useTextareaResize();

    const { formData, getFormFieldProps } = useFormData({
        date: formatDateISO(new Date()),
        mileage: vehicle.estimatedMileage,
        notes: '',
        cost: '',
        ...record,
    }, [record]);

    const { mutate: createOrUpdateRecord, isProcessing, error } = useMutation(records.createOrUpdateRecord, {
        onSuccess() {
            router.push(`/vehicles/${vehicle.id}`);
        },
    });

    const { mutate: destroyRecord } = useMutation(records.destroyRecord, {
        onSuccess() {
            router.push(`/vehicles/${vehicle.id}`);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        createOrUpdateRecord(vehicle.id, {
            ...formData,
            date: formatDateISO(new Date(formData.date)),
        });
    };

    const handleDelete = (e) => {
        e.preventDefault();
        if (!record) return;
        destroyRecord(vehicle.id, record.id);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {error && 'errors' in error && (
                    <FormErrors errors={error.errors} />
                )}

                <SimpleGrid spacing={[null, 7]} templateColumns={['auto', '1fr 2fr']}>
                    <Box>
                        <FormControl mb={4} id="date" isRequired>
                            <FormLabel>Date</FormLabel>

                            <Input type="hidden" {...getFormFieldProps('date')} />
                            <DatePicker initialDate={parseDateUTC(formData.date)} />
                        </FormControl>
                    </Box>
                    <Box flex={1}>
                        <FormControl mb={4} id="Notes" isRequired>
                            <FormLabel>Notes</FormLabel>
                            <Textarea ref={textareaRef} {...getFormFieldProps('notes')} />
                        </FormControl>
                        <FormControl mb={4} id="mileage" isRequired>
                            <FormLabel>Mileage</FormLabel>
                            <InputGroup size="md">
                                <Input {...getFormFieldProps('mileage', mileageFieldHelpers)} />
                                <InputRightAddon>{vehicle.distanceUnit}</InputRightAddon>
                            </InputGroup>
                        </FormControl>
                        <FormControl mb={4} id="cost">
                            <FormLabel>Cost</FormLabel>
                            <InputGroup size="md">
                                <InputLeftAddon>{getCurrencySymbol()}</InputLeftAddon>
                                <Input {...getFormFieldProps('cost', costFieldHelpers)} />
                            </InputGroup>
                        </FormControl>
                    </Box>
                </SimpleGrid>

                <SubmitButton isProcessing={isProcessing} />
            </form>

            {Boolean(record) && (
                <Box mt={10}>
                    <DestroyButton
                        confirmTitle="Please confirm delete"
                        confirmBody="You can't undo this action afterwards."
                        onConfirm={handleDelete}
                    >
                        Delete Record
                    </DestroyButton>
                </Box>
            )}
        </>
    );
};

export default NewServiceForm;
