import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import getColorPalette from 'utils/colors';

export interface VehicleColorIndicatorProps {
    color: string | null | undefined;
    size?: number;
}

export const VehicleColorIndicator: React.FC<VehicleColorIndicatorProps> = ({ color, size = 6 }) => {
    const bg = color || '#fafafa';

    const p = getColorPalette(bg);
    const secondaryBg = useColorModeValue(p[400], p[600]);

    const background = `linear-gradient(0deg, ${secondaryBg} 50%, ${bg} 50%)`;

    return (
        <Box bg={background} w={size} h={size} />
    );
};

export default VehicleColorIndicator;
