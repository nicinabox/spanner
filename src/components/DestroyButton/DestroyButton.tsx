import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

export interface DestroyButtonProps {
    confirmTitle?: string;
    confirmBody?: string;
    onConfirm: (event: React.MouseEventHandler<HTMLButtonElement>) => void;
}

export const DestroyButton: React.FC<DestroyButtonProps> = ({
    children,
    confirmTitle = 'Please confirm delete',
    confirmBody = "You can't undo this action afterwards.",
    onConfirm,
}) => {
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const cancelDeleteRef = useRef<HTMLButtonElement>(null);

    const onClose = () => setIsConfirmDeleteOpen(false);

    return (
        <>
            <Button variant="outline" size="sm" colorScheme="red" onClick={() => setIsConfirmDeleteOpen(true)}>
                {children}
            </Button>

            <AlertDialog
                isOpen={isConfirmDeleteOpen}
                leastDestructiveRef={cancelDeleteRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {confirmTitle}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {confirmBody}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelDeleteRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={onConfirm} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default DestroyButton;
