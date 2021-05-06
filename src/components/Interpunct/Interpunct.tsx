import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';

interface InterpunctProps extends TextProps {
    spacing?: number;
}

export const Interpunct: React.FC<InterpunctProps> = ({ spacing = 1, ...props }) => (
    <Text {...props} display="inline-block" ml={spacing} mr={spacing}>
        ·
    </Text>
);

export default Interpunct;
