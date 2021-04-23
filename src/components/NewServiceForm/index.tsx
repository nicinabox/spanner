import { Box, Button, FormControl, FormLabel, HStack, Input, Textarea } from '@chakra-ui/react';
import DatePicker from 'components/DatePicker';
import { Vehicle } from 'queries/vehicles';
import React, { useState } from 'react';

export interface NewServiceFormProps {
    vehicle: Vehicle;
}

export const NewServiceForm: React.FC<NewServiceFormProps> = ({ vehicle }) => {
    const handleSubmit = () => {

    }

    return (
        <form onSubmit={handleSubmit}>
            <HStack spacing={8}>
                <Box>
                    <FormControl mb={4} id="date" isRequired>
                        <FormLabel>Date</FormLabel>
                        <DatePicker />
                    </FormControl>
                </Box>
                <Box flex={1}>
                    <FormControl mb={4} id="Notes" isRequired>
                        <FormLabel>Notes</FormLabel>
                        <Textarea />
                    </FormControl>
                    <FormControl mb={4} id="mileage" isRequired>
                        <FormLabel>Mileage</FormLabel>
                        <Input type="number" defaultValue={vehicle.estimatedMileage} />
                    </FormControl>
                    <FormControl mb={4} id="cost">
                        <FormLabel>Cost</FormLabel>
                        <Input type="number" />
                    </FormControl>
                </Box>
            </HStack>

            <Button type="submit">
                Save
            </Button>
        </form>
    );
};

export default NewServiceForm;
