import React from 'react';
import Link from 'next/link';
import { Container, HStack } from '@chakra-ui/react';
import Page from 'components/common/Page';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import useRequest from 'hooks/useRequest';
import { Vehicle, vehicleAPIPath } from 'queries/vehicles';

export interface ImportRecordsPageProps {
    params: {
        vehicleId: string;
    }
}

const PageHeader = () => {
    return (
        <Header
            LeftComponent={(
                <HStack spacing={2}>
                    <BackButton>
                        Back
                    </BackButton>
                </HStack>
            )}
        />
    );
};

export const ImportRecordsPage: React.FC<ImportRecordsPageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehicleAPIPath(params.vehicleId));

    return (
        <Page
            Header={<PageHeader />}
        >
            <Container>
                TODO
            </Container>
        </Page>
    );
};

export default ImportRecordsPage;

export { getServerSideProps } from '../[vehicleId]';
