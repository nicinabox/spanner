import { EditIcon } from '@chakra-ui/icons';
import { Button, Container, Flex } from '@chakra-ui/react';
import EmptyState from 'components/common/EmptyState';
import MarkdownBody from 'components/common/MarkdownBody';
import NotesForm from 'components/forms/NotesForm';
import React, { useState } from 'react';

export interface VehicleNotesProps {
    vehicle: API.Vehicle;
}

export const VehicleNotes: React.FC<VehicleNotesProps> = ({ vehicle }) => {
    const [editing, setEditing] = useState(false);

    const isEmpty = !vehicle.notes && !editing;

    if (isEmpty) {
        return (
            <EmptyState
                heading="Notes are for hard-to-remember things"
                details="Add tire pressures, oil capacity, or how to reset the clock."
                action={(
                    <Button colorScheme="brand" leftIcon={<EditIcon />} onClick={() => setEditing(true)} shadow="lg">
                        Edit Notes
                    </Button>
                )}
            />
        );
    }

    return (
        <Container maxW="container.md">
            {editing ? (
                <NotesForm
                    formValues={vehicle}
                    onError={() => setEditing(true)}
                    onSuccess={() => setEditing(false)}
                    onCancel={() => setEditing(false)}
                />
            ) : (
                <>
                    <Flex direction="row-reverse" mb={6}>
                        <Button colorScheme="brand" size="sm" leftIcon={<EditIcon />} onClick={() => setEditing(true)}>
                            Edit
                        </Button>
                    </Flex>

                    <MarkdownBody body={vehicle.notes} />
                </>
            )}
        </Container>
    );
};

export default VehicleNotes;
