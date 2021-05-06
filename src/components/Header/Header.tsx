import {
    Link, Box, Flex, SimpleGrid, BoxProps, HStack, useStyleConfig,
} from '@chakra-ui/react';
import ColorModeButton from 'components/ColorModeButton';
import React from 'react';

export interface HeaderProps extends BoxProps {
    LeftComponent?: React.ReactNode;
    CenterComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ LeftComponent, CenterComponent, ...boxProps }) => {
    const styles = useStyleConfig('Header');

    return (
        <Box __css={styles} {...boxProps}>
            <SimpleGrid columns={3}>
                <Box>
                    {LeftComponent}
                </Box>
                <Flex justify="center">
                    {CenterComponent}
                </Flex>
                <Flex justify="flex-end">
                    <HStack>
                        <ColorModeButton />

                        <Box>
                            User
                        </Box>
                    </HStack>
                </Flex>
            </SimpleGrid>
        </Box>
    );
};

export default Header;
