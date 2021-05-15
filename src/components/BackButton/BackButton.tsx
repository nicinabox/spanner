import { ArrowBackIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

export interface BackButtonProps {
    href?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ href, children }) => {
    const router = useRouter();

    const Container = useCallback(
        (props) => {
            if (href) return <Link href={href} passHref {...props} />;
            return props.children;
        },
        [href],
    );

    return (
        <Container>
            <Button
                as={href ? 'a' : undefined}
                onClick={(e) => {
                    if (!href) {
                        e.preventDefault();
                        router.back();
                    }
                }}
                leftIcon={<ArrowBackIcon />}
                size="sm"
                variant="solid"
                colorScheme="gray"
            >
                {children}
            </Button>
        </Container>
    );
};

export default BackButton;
