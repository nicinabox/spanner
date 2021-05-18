import React from 'react';
import { Box, Link } from '@chakra-ui/react';
import styled from '@emotion/styled';

export interface LogoProps {
    height?: number
}

export const Logo: React.FC<LogoProps> = ({ height = 60 }) => (
    <Link href="/" display="inline-block" opacity={0.5} _hover={{ opacity: 1 }}>
        <Box h={height}>
            <Img src="/assets/logo-white.png" alt="Spanner" />
        </Box>
    </Link>
);

const Img = styled.img`
    max-height: 100%;
`;

export default Logo;
