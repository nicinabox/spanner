import { Box, Button, Container, Flex, Heading, HStack, Spacer, Text, Textarea } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import MarkdownBody from 'components/MarkdownBody';
import useTextareaResize from 'hooks/useTextareaResize';
import useFormData from 'hooks/useFormData';
import { mutate, useMutation } from 'hooks/useRequest';
import { updateVehicle, Vehicle, vehiclePath } from 'queries/vehicles';

export interface VehicleNotesProps {
    vehicle: Vehicle;
}

export const VehicleNotes: React.FC<VehicleNotesProps> = ({ vehicle }) => {
    const [editing, setEditing] = useState(false);
    const textareaRef = useTextareaResize();

    const { formData, getFormFieldProps, setFormField } = useFormData({
        notes: vehicle.notes ?? '',
    })

    const { mutate: updateVehicleMutation } = useMutation(updateVehicle, {
        onError() {
            setEditing(true);
            mutate(vehiclePath(vehicle.id));
        }
    });

    const handleSaveNotes = () => {
        setEditing(false);
        mutate(vehiclePath(vehicle.id), { ...vehicle, ...formData }, false);
        updateVehicleMutation(vehicle.id, formData);
    }

    return (
        <>
            <Container maxW="container.xl" mb={6}>
                {editing ? (
                    <HStack spacing={3}>
                        <Button colorScheme="brand" size="sm" onClick={handleSaveNotes}>
                            Save
                        </Button>
                        <Button colorScheme="brand" variant="ghost" size="sm" onClick={() => {
                            setEditing(false);
                            setFormField('notes', vehicle.notes);
                        }}>
                            Cancel
                        </Button>
                    </HStack>
                ) : (
                    <Button colorScheme="brand" size="sm" leftIcon={<EditIcon />} onClick={() => setEditing(true)}>
                        Edit
                    </Button>
                )}
            </Container>

            <Container maxW="container.md">
                {editing ? (
                    <Textarea
                        ref={textareaRef}
                        sx={{ fontFamily: 'monospace' }}
                        {...getFormFieldProps('notes')}
                        minH={32}
                        autoFocus
                    />
                ) : (
                    vehicle.notes ? <MarkdownBody body={vehicle.notes} /> : null
                )}
            </Container>

            {!Boolean(vehicle.notes) && !editing && (
                <Container maxW="container.xl">
                    <Heading>
                        You don't have any notes yet
                    </Heading>
                    <Text>
                        Keep notes for those hard to remember things, like tire pressures and how to reset the clock.
                    </Text>
                </Container>
            )}
        </>
    );
};

export default VehicleNotes;
