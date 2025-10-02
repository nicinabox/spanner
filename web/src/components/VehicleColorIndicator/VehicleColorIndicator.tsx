import { Box } from '@chakra-ui/react';
import React from 'react';
import getColorPalette from 'utils/colors';

export interface VehicleColorIndicatorProps {
    color: string | null | undefined;
    size?: number;
    borderWidth?: number;
}

export const VehicleColorIndicator: React.FC<VehicleColorIndicatorProps> = ({
    color,
    size = 6,
    borderWidth = 2,
}) => {
    const bg = color || '#fafafa';
    const p = getColorPalette(bg);

    const background = `linear-gradient(0deg, ${p[600]} 50%, ${bg} 50%)`;

    return (
        <Box
            bg={background}
            borderRadius="full"
            borderWidth={borderWidth}
            borderColor={p[400]}
            w={size}
            h={size}
        />
    );
};

export default VehicleColorIndicator;
