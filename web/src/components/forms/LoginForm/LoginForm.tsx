import React, { useState } from 'react';
import {
    Input,
    Button,
    FormHelperText,
    FormControl,
    Flex,
    AlertIcon,
    Alert,
    Center,
    Box,
    FormLabel,
    Heading,
    Text,
    Divider,
} from '@chakra-ui/react';
import { sample } from 'lodash';
import * as session from 'queries/session';
import useFormData from 'hooks/useFormData';
import useMutation from 'hooks/useMutation';
import { useRouter } from 'next/router';

function getPlaceholder() {
    return sample([
        'lando@cloudci.ty',
        'robertpaulson@loustave.rn',
        'drspaceman@rockefellerpla.ce',
        'mal@firef.ly',
    ]);
}

export const LoginForm: React.FC = () => {
    const router = useRouter();

    const [loginStatus, setLoginStatus] = useState<
    'pendingEmail' | 'pendingLoginToken'
    >('pendingEmail');
    const [pendingAuth, setPendingAuth] = useState(false);

    const newSessionForm = useFormData({ email: '' });
    const loginForm = useFormData({ loginToken: '' });

    const requestSession = useMutation(session.requestSession, {
        onSuccess() {
            setLoginStatus('pendingLoginToken');
        },
    });

    const handleRequestSession = async (ev) => {
        ev.preventDefault();
        requestSession.mutate(newSessionForm.formData.email);
    };

    const handleLogin = (ev) => {
        ev.preventDefault();
        setPendingAuth(true);
        router.push(`/login/${loginForm.formData.loginToken}`);
    };

    const handleReset = () => {
        requestSession.reset();
        setLoginStatus('pendingEmail');
        loginForm.setFormData({ loginToken: '' });
        setPendingAuth(false);
    };

    if (requestSession.error) {
        return (
            <Box p="4">
                <Alert status="error">
                    <AlertIcon />
                    {requestSession.error}
                </Alert>

                <Center mt="4">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        Try again
                    </Button>
                </Center>
            </Box>
        );
    }

    if (loginStatus === 'pendingLoginToken') {
        return (
            <Box p={4}>
                <Center flexDirection="column">
                    <Heading size="md" mb={2}>
                        Check your email
                    </Heading>
                    <Text>
                        We sent an email to you at{' '}
                        <strong>{newSessionForm.formData.email}</strong>. It has
                        a magic link that will sign you in.
                    </Text>
                </Center>

                <Divider my={8} />

                <Center flexDirection="column">
                    <Heading size="sm" mb={4}>
                        Alternatively...
                    </Heading>
                </Center>

                <form onSubmit={handleLogin}>
                    <FormControl>
                        <FormLabel>
                            Paste the login token from the email
                        </FormLabel>
                        <Flex>
                            <Input
                                {...loginForm.register('loginToken')}
                                autoFocus
                            />
                            <Button
                                type="submit"
                                colorScheme="brand"
                                ml="4"
                                isLoading={pendingAuth}
                                disabled={pendingAuth}
                            >
                                Sign in
                            </Button>
                        </Flex>
                    </FormControl>
                </form>

                <Center mt={8}>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        Try again
                    </Button>
                </Center>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <form onSubmit={handleRequestSession}>
                <FormControl>
                    <FormLabel>Enter your email to get started</FormLabel>
                    <Flex>
                        <Input
                            {...newSessionForm.register('email')}
                            type="email"
                            placeholder={getPlaceholder()}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            colorScheme="brand"
                            ml="4"
                            disabled={requestSession.isProcessing}
                            isLoading={requestSession.isProcessing}
                        >
                            Next
                        </Button>
                    </Flex>
                    <FormHelperText>
                        First time? We&apos;ll setup your account automagically.
                    </FormHelperText>
                </FormControl>
            </form>
        </Box>
    );
};

export default LoginForm;
