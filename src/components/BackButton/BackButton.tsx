import { ArrowBackIcon } from '@chakra-ui/icons';
import { Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

export interface BackButtonProps {
    href: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ href, children }) => (
    <Link href={href} passHref>
        <Button
            as="a"
            leftIcon={<ArrowBackIcon />}
            size="sm"
            variant="solid"
            colorScheme="gray"
        >
            {children}
        </Button>
    </Link>
);

export default BackButton;
