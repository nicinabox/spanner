import { Heading, Box, useColorModeValue, useToken } from '@chakra-ui/react';
import React from 'react';

export interface FormSectionProps {
    heading?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
    children,
    heading,
}) => {
    const bg = useColorModeValue('white', 'whiteAlpha.100');
    const [gray100, gray300] = useToken('colors', ['none', 'gray.700']);
    const borderColor = useColorModeValue(gray100, gray300);

    return (
        <>
            {heading && (
                <Heading size="md" mb={2}>
                    {heading}
                </Heading>
            )}

            <Box
                bg={bg}
                p={[4, 8]}
                mb={8}
                mx={[-4, 0]}
                borderY={[`1px solid ${borderColor}`, null]}
                borderX={[null, `1px solid ${borderColor}`]}
                shadow="base"
                borderRadius={[null, 'sm']}
            >
                {children}
            </Box>
        </>
    );
};

export default FormSection;
