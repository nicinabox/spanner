import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import getColorPalette from 'utils/colors';

export interface VehicleColorIndicatorProps {
    color: string | null | undefined;
    size?: number;
}

export const VehicleColorIndicator: React.FC<VehicleColorIndicatorProps> = ({ color, size = 5 }) => {
    const bg = color || 'transparent';

    const p = getColorPalette(bg);
    const borderColor = useColorModeValue(p[400], p[900]);

    return (
        <Box bg={bg} borderColor={borderColor} borderWidth={1} w={size} h={size} borderRadius="full" />
    );
};

export default VehicleColorIndicator;
