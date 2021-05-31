import { Button, ButtonProps, LightMode } from '@chakra-ui/react';
import React from 'react';

export interface FormButtonProps extends ButtonProps {
    isProcessing?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
    children = 'Save', isProcessing, ...props
}) => {
    const Container = props.type === 'submit' ? LightMode : React.Fragment;

    return (
        <Container>
            <Button
                colorScheme="brand"
                disabled={isProcessing}
                isLoading={isProcessing}
                w={['100%', 'fit-content']}
                {...props}
            >
                {children}
            </Button>
        </Container>
    );
};

export default FormButton;
