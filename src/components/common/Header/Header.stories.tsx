import React from 'react';

import { Meta } from '@storybook/react';

import { HStack } from '@chakra-ui/react';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import vehicle from '__fixtures__/vehicle';
import { Header, HeaderProps } from './Header';
import BackButton from '../BackButton';

const Template: React.VFC<HeaderProps> = (props) => (
    <Header
        LeftComponent={(
            <HStack spacing={2}>
                <BackButton>
                    Back
                </BackButton>

                <VehicleActionsMenu vehicle={vehicle} />
            </HStack>
        )}
        {...props}
    />

);

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/Header',
    component: Header,
} as Meta;
