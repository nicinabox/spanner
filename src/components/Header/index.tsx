import { Link, Box, Flex } from '@chakra-ui/react';
import React from 'react';

export interface HeaderProps {
    LeftComponent?: React.ReactNode;
    CenterComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ LeftComponent, CenterComponent }) => {
    return (
        <Box bg="brand.primary" mb={6} p={2}>
            <Flex justify="space-between" align="center">
                <Box>
                    {LeftComponent}
                </Box>
                <Box>
                    {CenterComponent}
                </Box>
                <Box>
                    User
                </Box>
            </Flex>
        </Box>
    );
};


export default Header;
