import { Link, Box, Flex, SimpleGrid } from '@chakra-ui/react';
import React from 'react';

export interface HeaderProps {
    LeftComponent?: React.ReactNode;
    CenterComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ LeftComponent, CenterComponent }) => {
    return (
        <Box bg="brand.primary" mb={6} p={2} position="sticky" top="0" zIndex={1}>
            <SimpleGrid columns={3}>
                <Box>
                    {LeftComponent}
                </Box>
                <Flex justify="center">
                    {CenterComponent}
                </Flex>
                <Flex justify="flex-end">
                    User
                </Flex>
            </SimpleGrid>
        </Box>
    );
};


export default Header;
