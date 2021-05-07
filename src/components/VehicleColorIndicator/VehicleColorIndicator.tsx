import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import getColorPalette from 'utils/colors';

export interface VehicleColorIndicatorProps {
    color: string | null | undefined;
    size?: number;
}

export const VehicleColorIndicator: React.FC<VehicleColorIndicatorProps> = ({ color, size = 5 }) => {
    if (!color) return null;

    const p = getColorPalette(color);
    const borderColor = useColorModeValue(p[400], p[900]);

    return (
        <Box bg={color} borderColor={borderColor} borderWidth={1} w={size} h={size} borderRadius={size} />
    );
};

export default VehicleColorIndicator;
