import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

export interface DangerZoneProps {}

export const DangerZone: React.FC<DangerZoneProps> = ({ children }) => {
    const dividerBg = useColorModeValue('gray.100', 'gray.900');

    return (
        <Box my={10}>
            <Box mb={10} mx={[-4, null]} height={4} bg={dividerBg} />
            {children}
        </Box>
    );
};

export default DangerZone;
