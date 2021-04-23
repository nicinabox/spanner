import { Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import DatePicker from 'components/DatePicker';
import { addMonths } from 'date-fns';
import { Vehicle } from 'queries/vehicles';
import React, { useState } from 'react';

export interface NewReminderFormProps {
    vehicle: Vehicle;
}

export const NewReminderForm: React.FC<NewReminderFormProps> = ({ vehicle }) => {
    const [dependentField, setDependentField] = useState<string | undefined>();

    const handleSubmit = () => {

    }

    return (
        <form onSubmit={handleSubmit}>
            <FormControl mb={4} id="note" isRequired>
                <FormLabel>Note</FormLabel>
                <Input type="text" name="note" />
            </FormControl>

            <FormControl mb={4} id="reminder">
                <FormLabel>Remind me</FormLabel>
                <Select name="reminder" onChange={({ target }) => setDependentField(target.value)}>
                    <option value="">Don't remind me</option>
                    <option value="date_or_mileage">On a date or mileage, whichever is first</option>
                    <option value="date">On a date</option>
                    <option value="mileage">At a mileage</option>
                </Select>
            </FormControl>

            {['date', 'date_or_mileage'].includes(dependentField) && (
                <FormControl mb={4} id="date" isRequired>
                    <FormLabel>Date</FormLabel>
                    <DatePicker name="date" initialDate={addMonths(new Date(), 6)} />
                </FormControl>
            )}

            {['mileage', 'date_or_mileage'].includes(dependentField) && (
                <FormControl mb={4} id="mileage" isRequired>
                    <FormLabel>Mileage</FormLabel>
                    <Input type="text" name="mileage" />
                </FormControl>
            )}

            <Button type="submit">
                Save
            </Button>
        </form>
    );
};

export default NewReminderForm;
