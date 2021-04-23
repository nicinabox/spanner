import { FormControl, FormLabel, Input, FormHelperText, Button } from '@chakra-ui/react';
import { Vehicle } from 'queries/vehicles';
import React, { useState } from 'react';
import { formatNumber } from 'utils/number';

export interface MileageAdjustmentFormProps {
    vehicle: Vehicle;
}

export const MileageAdjustmentForm: React.FC<MileageAdjustmentFormProps> = ({ vehicle }) => {
    const [mileage, setMileage] = useState<number | undefined>();

    const handleSubmit = () => {

    }

    return (
        <form onSubmit={handleSubmit}>
            <FormControl mb={4} id="mileage" isRequired>
                <FormLabel>Enter your current mileage</FormLabel>
                <Input type="number" value={mileage} onChange={({ target }) => setMileage(Number(target.value))} autoFocus />
                <FormHelperText>Estimated mileage is {formatNumber(vehicle.estimatedMileage)}</FormHelperText>
            </FormControl>

            <Button type="submit">
                Save
            </Button>
        </form>
    );
};

export default MileageAdjustmentForm;
