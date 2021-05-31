import {
    Box, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, InputRightAddon, SimpleGrid, Textarea,
} from '@chakra-ui/react';
import { ParsedQs } from 'qs';
import DatePicker from 'components/common/DatePicker';
import DestroyButton from 'components/common/DestroyButton';
import FormErrors from 'components/common/FormErrors';
import FormButton from 'components/common/FormButton';
import useFormData from 'hooks/useFormData';
import useMutation from 'hooks/useMutation';
import useTextareaResize from 'hooks/useTextareaResize';
import { capitalize } from 'lodash';
import { useRouter } from 'next/router';
import * as records from 'queries/records';
import { Vehicle } from 'queries/vehicles';
import React from 'react';
import { formatDateISO, parseDateUTC } from 'utils/date';
import { mileageFieldHelpers, costFieldHelpers } from 'utils/form';
import lang from 'utils/lang';
import { getCurrencySymbol } from 'utils/number';
import { vehiclePath } from 'utils/resources';
import FormSection from 'components/common/FormSection';
import DangerZone from 'components/common/DangerZone';

export interface RecordFormProps {
    vehicle: Vehicle;
    record?: Partial<records.VehicleRecord> | ParsedQs;
    onSuccess?: () => Promise<void> | void;
}

export const RecordForm: React.FC<RecordFormProps> = ({ vehicle, record, onSuccess }) => {
    const router = useRouter();
    const textareaRef = useTextareaResize();

    const { formData, register, setValue } = useFormData({
        date: formatDateISO(new Date()),
        mileage: vehicle.estimatedMileage,
        notes: '',
        cost: '',
        ...record,
    }, [record]);

    const { mutate: createOrUpdateRecord, isProcessing, error } = useMutation(records.createOrUpdateRecord, {
        onSuccess: async () => {
            await onSuccess?.();
            router.replace(vehiclePath(vehicle.id));
        },
    });

    const { mutate: destroyRecord } = useMutation(records.destroyRecord, {
        onSuccess() {
            router.replace(vehiclePath(vehicle.id));
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createOrUpdateRecord(vehicle.id, formData);
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

                <FormSection>
                    <SimpleGrid spacing={[null, 7]} templateColumns={['auto', null, '1fr 2fr']}>
                        <Box>
                            <FormControl mb={4} id="date" isRequired>
                                <FormLabel>Date</FormLabel>

                                <Input type="hidden" {...register('date')} />
                                <DatePicker initialDate={parseDateUTC(formData.date)} onChange={(date) => setValue('date', formatDateISO(date))} />
                            </FormControl>
                        </Box>
                        <Box flex={1}>
                            <FormControl mb={4} id="Notes" isRequired>
                                <FormLabel>Notes</FormLabel>
                                <Textarea ref={textareaRef} {...register('notes')} />
                            </FormControl>
                            <FormControl mb={4} id="mileage" isRequired>
                                <FormLabel>{capitalize(lang.mileageLabel[vehicle.distanceUnit])}</FormLabel>
                                <InputGroup size="md">
                                    <Input {...register('mileage', mileageFieldHelpers)} inputMode="numeric" pattern="[0-9]*" />
                                    <InputRightAddon>{vehicle.distanceUnit}</InputRightAddon>
                                </InputGroup>
                            </FormControl>
                            <FormControl mb={4} id="cost">
                                <FormLabel>Cost</FormLabel>
                                <InputGroup size="md">
                                    <InputLeftAddon>{getCurrencySymbol()}</InputLeftAddon>
                                    <Input {...register('cost', costFieldHelpers)} inputMode="numeric" pattern="[0-9]*" />
                                </InputGroup>
                            </FormControl>
                        </Box>
                    </SimpleGrid>
                </FormSection>
                <FormButton type="submit" isProcessing={isProcessing} />
            </form>

            {Boolean(record?.id) && (
                <DangerZone>
                    <DestroyButton
                        confirmTitle="Please confirm delete"
                        confirmBody="You can't undo this action afterwards."
                        onConfirm={handleDelete}
                    >
                        Delete record
                    </DestroyButton>
                </DangerZone>
            )}
        </>
    );
};

export default RecordForm;
