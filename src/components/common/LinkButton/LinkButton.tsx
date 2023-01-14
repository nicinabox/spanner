import React from 'react';
import Link from 'next/link';
import { Button, ButtonProps } from '@chakra-ui/react';

export interface LinkButtonProps extends ButtonProps {
    href: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ href, children, ...buttonProps }) => {
    return (
        <Button
            as={Link}
            href={href}
            passHref
            colorScheme="brand"
            {...buttonProps}
        >
            {children}
        </Button>
    );
};

export default LinkButton;
