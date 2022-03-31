import { ArrowBackIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { Button, LightMode } from '@chakra-ui/react';
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
        <LightMode>
            <Container>
                <Button
                    size="sm"
                    variant="solid"
                    colorScheme="gray"
                    color="gray.900"
                    as={href ? 'a' : undefined}
                    leftIcon={<ArrowBackIcon />}
                    onClick={(e) => {
                        if (!href) {
                            e.preventDefault();
                            router.back();
                        }
                    }}
                >
                    {children}
                </Button>
            </Container>
        </LightMode>
    );
};

export default BackButton;
