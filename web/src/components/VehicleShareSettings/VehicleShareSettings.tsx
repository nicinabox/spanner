import React from 'react';
import {
    Text,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    useClipboard,
} from '@chakra-ui/react';
import * as vehicles from 'queries/vehicles';
import useMutation, { mutate } from 'hooks/useMutation';

export interface VehicleShareSettingsProps {
    vehicle: API.Vehicle;
}

export const VehicleShareSettings: React.FC<VehicleShareSettingsProps> = ({
    vehicle,
}) => {
    const { enableSharing } = vehicle.preferences;
    const shareUrl = `${window.location.origin}/share/vehicles/${vehicle.id}`;

    const { hasCopied, onCopy } = useClipboard(shareUrl);
    const { mutate: updateVehicle, isProcessing } = useMutation(
        vehicles.updateVehicle,
        {
            onSuccess(data) {
                mutate(vehicles.vehicleAPIPath(vehicle.id), data, false);
            },
        },
    );

    const toggle = () => {
        updateVehicle({
            id: vehicle.id,
            preferences: {
                enableSharing: !enableSharing,
            },
        });
    };

    return (
        <>
            <Text mb={4}>
                Sharing will enable anyone with the link to view.
            </Text>

            {enableSharing && (
                <InputGroup size="md" mb={4}>
                    <Input
                        pr="4.5rem"
                        readOnly
                        variant="filled"
                        value={shareUrl}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={onCopy}>
                            {hasCopied ? 'Copied' : 'Copy'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            )}

            <Button
                colorScheme={enableSharing ? 'red' : 'brand'}
                onClick={toggle}
                isLoading={isProcessing}
            >
                {enableSharing ? 'Stop' : 'Enable'} Sharing
            </Button>
        </>
    );
};

export default VehicleShareSettings;
