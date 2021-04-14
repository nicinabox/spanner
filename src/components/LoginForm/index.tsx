import React, { useState } from 'react';
import { Input, Button, FormHelperText, FormControl, Flex, Spacer, AlertIcon, Alert, Center } from "@chakra-ui/react"
import { CheckCircleIcon } from '@chakra-ui/icons';
import { sample } from 'lodash';
import { requestSession } from '../../queries/session';

function getPlaceholder() {
    return sample([
      'lando@cloudci.ty',
      'robertpaulson@loustave.rn',
      'drspaceman@rockefellerpla.ce',
      'mal@firef.ly',
    ])
}

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState();

    const handleChange = (event) => setEmail(event.target.value)
    
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
    }

    const handleReset = () => {
        setEmail(undefined);
        setError(undefined);
        setPending(false);
    }

    const isFormValid = Boolean(email);

    if (error) {
        return (
            <div>
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>

                <Center mt="4">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        Try again
                    </Button>
                </Center>
            </div>
        )
    }
    
    if (pending) {
        return (
            <div>
                <Alert status="success">
                    <AlertIcon />
                    Check your email for a Sign In button.
                </Alert>

                <Center mt="4">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        Try again
                    </Button>
                </Center>
            </div>
        )
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <FormControl>
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
                    First time? We'll setup your account automagically.
                </FormHelperText>
            </FormControl>
        </form>
    )
}

export default LoginForm;