import {
    Box, Button, FormControl, FormLabel, Heading, HStack, Input, InputGroup, InputLeftAddon, InputRightAddon, SimpleGrid, Textarea, VStack,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import DatePicker from 'components/DatePicker';
import useFormData from 'hooks/useFormData';
import useMutation from 'hooks/useMutation';
import * as records from 'queries/records';
import { Vehicle } from 'queries/vehicles';
import { formatDateISO, parseDateISO } from 'utils/date';
import React, { useEffect } from 'react';
import FormErrors from 'components/FormErrors';
import SubmitButton from 'components/SubmitButton';
import { useRouter } from 'next/router';
import { getCurrencySymbol } from 'utils/number';
import useTextareaResize from 'hooks/useTextareaResize';

export interface NewServiceFormProps {
    vehicle: Vehicle;
    record?: records.VehicleRecord;
}

export const NewServiceForm: React.FC<NewServiceFormProps> = ({ vehicle, record }) => {
    const router = useRouter();
    const textareaRef = useTextareaResize();

    const {
        formData, getFormFieldProps, setFormData, setFormField,
    } = useFormData({
        date: new Date().toISOString(),
        notes: '',
        mileage: vehicle.estimatedMileage,
        cost: '',
        ...record,
    }, (fieldName, fieldValue) => {
        if (fieldName === 'mileage') {
            return fieldValue.replace(/\D/g, '');
        }
        if (fieldName === 'cost') {
            return fieldValue.replace(/\D/g, '');
        }
        return fieldValue;
    });

    useEffect(() => {
        if (record) setFormData({ ...record });
    }, [record]);

    const { mutate: createOrUpdateRecord, isProcessing, error } = useMutation(records.createOrUpdateRecord, {
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

    return (
        <form onSubmit={handleSubmit}>
            {error && 'errors' in error && (
                <FormErrors errors={error.errors} />
            )}

            <SimpleGrid columns={[1, 2]} spacing={2} templateColumns={['auto', '1fr 2fr']}>
                <Box>
                    <FormControl mb={4} id="date" isRequired>
                        <FormLabel>Date</FormLabel>

                        <input type="hidden" {...getFormFieldProps('date')} />
                        <DatePicker onChange={(date) => setFormField('date', date)} initialDate={parseDateISO(formData.date)} />
                    </FormControl>
                </Box>
                <Box flex={1}>
                    <FormControl mb={4} id="Notes" isRequired>
                        <FormLabel>Notes</FormLabel>
                        <Textarea ref={textareaRef} {...getFormFieldProps('notes')} />
                    </FormControl>
                    <FormControl mb={4} id="mileage" isRequired>
                        <FormLabel>Mileage</FormLabel>
                        <InputGroup size="sm">
                            <Input {...getFormFieldProps('mileage')} />
                            <InputRightAddon>{vehicle.distanceUnit}</InputRightAddon>
                        </InputGroup>
                    </FormControl>
                    <FormControl mb={4} id="cost">
                        <FormLabel>Cost</FormLabel>
                        <InputGroup size="sm">
                            <InputLeftAddon>{getCurrencySymbol()}</InputLeftAddon>
                            <Input {...getFormFieldProps('cost')} />
                        </InputGroup>
                    </FormControl>
                </Box>
            </SimpleGrid>

            <SubmitButton isProcessing={isProcessing} />
        </form>
    );
};

export default NewServiceForm;
