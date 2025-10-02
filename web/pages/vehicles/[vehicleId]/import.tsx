import React from 'react';

import {
    Text,
    Container,
    Heading,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Alert,
    AlertIcon,
    Checkbox,
} from '@chakra-ui/react';
import Page from 'components/common/Page';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import useRequest from 'hooks/useRequest';
import { importRecords, vehicleAPIPath } from 'queries/vehicles';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import useFormData from 'hooks/useFormData';
import FormButton from 'components/common/FormButton';
import useMutation, { mutate } from 'hooks/useMutation';
import { useRouter } from 'next/router';
import { vehiclePath } from 'utils/resources';

export interface ImportRecordsPageProps {
    params: {
        vehicleId: string;
    };
}

const PageHeader = ({ vehicle }) => {
    return (
        <Header
            LeftComponent={
                <HStack spacing={2}>
                    <BackButton>Back</BackButton>
                    <VehicleActionsMenu vehicle={vehicle} />
                </HStack>
            }
        />
    );
};

export const ImportRecordsPage: React.FC<ImportRecordsPageProps> = ({
    params,
}) => {
    const router = useRouter();

    const { data: vehicle } = useRequest<API.Vehicle>(
        vehicleAPIPath(params.vehicleId),
    );

    const { formData, register, setValue } = useFormData({
        importFile: null,
        fuelly: false,
    });

    const { mutate: importRecordsMutation, isProcessing } = useMutation(
        importRecords,
        {
            onSuccess() {
                mutate(vehicleAPIPath(params.vehicleId));
                router.replace(vehiclePath(params.vehicleId));
            },
        },
    );

    const handleSubmit = (ev) => {
        ev.preventDefault();
        importRecordsMutation(params.vehicleId, formData);
    };

    return (
        <Page Header={<PageHeader vehicle={vehicle} />}>
            <Container maxW={[null, 'md']} p={0}>
                <Heading mb={6}>Import History</Heading>

                <Alert status="info" mb={4}>
                    <AlertIcon />
                    Upload a .csv file with the headers: date, mileage, cost,
                    notes
                </Alert>

                <form onSubmit={handleSubmit}>
                    <FormControl id="importFile" mb={4}>
                        <FormLabel>Upload csv</FormLabel>
                        <Input
                            name="importFile"
                            type="file"
                            p={2}
                            height="auto"
                            onChange={({ target }) =>
                                setValue('importFile', target.files?.[0])
                            }
                            required
                        />
                    </FormControl>

                    <FormControl id="fuelly" mb={4}>
                        <Checkbox {...register('fuelly')}>
                            This data is from Fuelly
                        </Checkbox>
                    </FormControl>

                    <Text color="red.300" mb={4}>
                        ⚠️ This will replace all your existing records for this
                        vehicle!
                    </Text>

                    <FormButton type="submit" isProcessing={isProcessing}>
                        Import
                    </FormButton>
                </form>
            </Container>
        </Page>
    );
};

export default ImportRecordsPage;

export { getServerSideProps } from '../[vehicleId]';
