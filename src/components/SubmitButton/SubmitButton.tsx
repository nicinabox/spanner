import { Button } from '@chakra-ui/react';
import React from 'react';

export interface SubmitButtonProps {
    isProcessing: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ children = 'Save', isProcessing }) => (
    <Button type="submit" colorScheme="brand" disabled={isProcessing} isLoading={isProcessing} w={['100%', 'fit-content']}>
        {children}
    </Button>
);

export default SubmitButton;
