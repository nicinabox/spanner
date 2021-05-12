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
            <SimpleGrid columns={columns} spacingX={2}>
                {LeftComponent}
                {CenterComponent}

                <Flex justify="flex-end">
                    {RightComponent}
                </Flex>
            </SimpleGrid>
        </Box>
    );
};

export default Header;
