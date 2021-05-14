import {
    Box, BoxProps, Flex, ResponsiveValue, SimpleGrid, useStyleConfig,
} from '@chakra-ui/react';
import React from 'react';

export interface HeaderProps extends BoxProps {
    LeftComponent?: React.ReactNode;
    CenterComponent?: React.ReactNode;
    RightComponent?: React.ReactNode;
    columns?: ResponsiveValue<number>;
}

export const Header: React.FC<HeaderProps> = ({
    LeftComponent, CenterComponent, RightComponent, columns = 3, ...boxProps
}) => {
    const styles = useStyleConfig('Header');

    return (
        <Box __css={styles} {...boxProps}>
            <Flex flexWrap="wrap" direction={['column', null, 'row']}>
                <Flex flex={1} mr={2}>
                    {LeftComponent}
                </Flex>
                <Flex flex={1} justify="center">
                    {CenterComponent}
                </Flex>

                <Flex justify="flex-end" flex={1}>
                    {RightComponent}
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
