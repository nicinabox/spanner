import {
    Box, Center, Container, Flex, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { vehiclesPath } from 'utils/resources';
import { withSession } from 'utils/session';
import LoginForm from 'components/forms/LoginForm';
import Logo from 'components/Logo';

export default function Home() {
    const bg = useColorModeValue('white', 'brand.900');

    return (
        <Flex minH="100vh" bg="brand.primary" align="center" justify="center" direction="column">
            <Center flex={1} my={8}>
                <Logo opacity={0.8} height={50} />
            </Center>
            <Container flex={3}>
                <Box boxShadow="xl" bg={bg} p={[2, 4, 8]} mb={8} borderRadius="lg">
                    <LoginForm />
                </Box>
            </Container>
        </Flex>
    );
}

export const getServerSideProps = withSession(async ({ req }) => {
    const { session } = req.session;

    if (session) {
        return {
            redirect: {
                destination: vehiclesPath(),
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
});
