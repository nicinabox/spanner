import React, { useState } from 'react';
import {
    Input, Button, FormHelperText, FormControl, Flex, Spacer, AlertIcon, Alert, Center, Box, FormLabel,
} from '@chakra-ui/react';
import { sample } from 'lodash';
import { requestSession } from '../../queries/session';

function getPlaceholder() {
    return sample([
        'lando@cloudci.ty',
        'robertpaulson@loustave.rn',
        'drspaceman@rockefellerpla.ce',
        'mal@firef.ly',
    ]);
}

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState();

    const handleChange = (event) => setEmail(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        try {
            await requestSession(email);
            setPending(true);
        } catch (err) {
            setLoading(false);
            setPending(false);
            setError(err.toString());
        }
    };

    const handleReset = () => {
        setError(undefined);
        setLoading(false);
        setPending(false);
    };

    const isFormValid = Boolean(email);

    if (error) {
        return (
            <Box p="4">
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>

                <Center mt="4">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        Try again
                    </Button>
                </Center>
            </Box>
        );
    }

    if (pending) {
        return (
            <Box p="4">
                <Alert status="success">
                    <AlertIcon />
                    Check your email for a Sign In button.
                </Alert>

                <Center mt="4">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        Try again
                    </Button>
                </Center>
            </Box>
        );
    }

    return (
        <Box p="4">
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>
                        Enter your email to get started
                    </FormLabel>
                    <Flex>
                        <Input
                            name="email"
                            type="email"
                            value={email}
                            placeholder={getPlaceholder()}
                            onChange={handleChange}
                            autoFocus
                        />
                        <Button type="submit" colorScheme="brand" ml="4" disabled={!isFormValid || loading} isLoading={loading}>Sign In</Button>
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
