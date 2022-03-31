import React from 'react';
import Link from 'next/link';
import { Button, ButtonProps } from '@chakra-ui/react';

export interface LinkButtonProps extends ButtonProps {
    href: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ href, children, ...buttonProps }) => {
    return (
        <Link href={href} passHref>
            <Button as="a" colorScheme="brand" {...buttonProps}>
                {children}
            </Button>
        </Link>
    );
};

export default LinkButton;
