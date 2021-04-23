import { useColorModeValue, Box, Container, TabList, Tab } from '@chakra-ui/react';
import React from 'react';

export interface TabMenuProps {
}

export const TabMenu: React.FC<TabMenuProps> = ({ children }) => {
    const tabListBg = useColorModeValue('brand.100', 'brand.800')

    return (
        <Box bg={tabListBg}>
            <Container maxW="container.xl" mb={6}>
                <TabList>
                    {children}
                </TabList>
            </Container>
        </Box>
    );
};

export default TabMenu;
