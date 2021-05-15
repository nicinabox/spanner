import { ArrowBackIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

export interface BackButtonProps {
}

export const BackButton: React.FC<BackButtonProps> = ({ children }) => {
    const router = useRouter();

    return (
        <Button
            onClick={(e) => {
                e.preventDefault();
                router.back();
            }}
            leftIcon={<ArrowBackIcon />}
            size="sm"
            variant="solid"
            colorScheme="gray"
        >
            {children}
        </Button>
    );
};

export default BackButton;
