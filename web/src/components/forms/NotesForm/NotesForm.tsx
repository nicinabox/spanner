import {
    Button, Flex, HStack, Textarea,
} from '@chakra-ui/react';
import useFormData from 'hooks/useFormData';
import useMutation, { mutate } from 'hooks/useMutation';
import useTextareaResize from 'hooks/useTextareaResize';
import { MutateParams } from 'queries/config';
import { updateVehicle, vehicleAPIPath } from 'queries/vehicles';
import React from 'react';

export interface NotesFormProps {
    formValues: MutateParams<Partial<API.Vehicle>>;
    onSuccess: () => void;
    onError: () => void;
    onCancel: () => void;
}

export const NotesForm: React.FC<NotesFormProps> = ({
    formValues, onSuccess, onError, onCancel,
}) => {
    const textareaRef = useTextareaResize();

    const { formData, register, setValue } = useFormData({
        ...formValues,
    });

    const { mutate: updateVehicleMutation, isProcessing } = useMutation(updateVehicle, {
        onSuccess,
        onError,
    });

    const handleSaveNotes = () => {
        mutate(vehicleAPIPath(formValues.id), formData, false);
        updateVehicleMutation(formData);
    };

    return (
        <>
            <Flex direction="row-reverse" mb={6}>
                <HStack spacing={3}>
                    <Button colorScheme="brand" size="md" onClick={handleSaveNotes} isLoading={isProcessing}>
                        Save
                    </Button>
                    <Button
                        colorScheme="brand"
                        variant="ghost"
                        size="md"
                        disabled={isProcessing}
                        onClick={() => {
                            setValue('notes', formValues.notes);
                            onCancel();
                        }}
                    >
                        Cancel
                    </Button>
                </HStack>
            </Flex>

            <Textarea
                ref={textareaRef}
                sx={{ fontFamily: 'monospace' }}
                {...register('notes')}
                minH="200px"
                autoFocus
            />
        </>
    );
};

export default NotesForm;
