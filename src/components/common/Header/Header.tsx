import {
    Box, BoxProps, Flex, useStyleConfig,
} from '@chakra-ui/react';
import React from 'react';

export interface HeaderProps extends BoxProps {
    LeftComponent?: React.ReactNode;
    CenterComponent?: React.ReactNode;
    RightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    LeftComponent, CenterComponent, RightComponent, children, ...boxProps
}) => {
    const styles = useStyleConfig('Header');

    return (
        <Box __css={styles} {...boxProps} shadow="md" maxW="100vw">
            {children || (
                <Flex flexWrap="wrap" direction={['column', 'row']}>
                    <Flex flex={1} mr={2} py={2}>
                        {LeftComponent}
                    </Flex>

                    <Flex flex={1} justify={['start']} overflowX={['auto', 'inherit']} maxW="100%">
                        {CenterComponent}
                    </Flex>

                    <Flex flex={1} justify="flex-end">
                        {RightComponent}
                    </Flex>
                </Flex>
            )}
        </Box>
    );
};

export default Header;
