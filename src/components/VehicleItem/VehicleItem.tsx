import {
    Box,
    Flex, Heading, HStack, LinkBox, LinkOverlay, Text, useStyleConfig,
} from '@chakra-ui/react';
import Interpunct from 'components/common/Interpunct';
import NumberBadge from 'components/common/NumberBadge';
import VehicleColorIndicator from 'components/VehicleColorIndicator';
import { mutate } from 'hooks/useMutation';
import NextLink from 'next/link';
import { vehicleAPIPath } from 'queries/vehicles';
import React from 'react';
import { getOverdueRemindersCount } from 'utils/reminders';
import { vehiclePath } from 'utils/resources';
import { formatEstimatedMileage, formatMilesPerYear } from 'utils/vehicle';

export interface VehicleItemProps {
    vehicle: API.Vehicle;
}

export const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle }) => {
    const styles = useStyleConfig('VehicleItem');

    return (
        <LinkBox sx={styles}>
            <NextLink href={vehiclePath(vehicle.id)} passHref>
                <LinkOverlay onClick={() => {
                    mutate(vehicleAPIPath(vehicle.id), vehicle, false);
                }}
                >
                    <Flex direction="column" minH={12}>
                        <Box mb="2">
                            <VehicleColorIndicator color={vehicle.color} size={7} />
                        </Box>

                        <Flex justify="space-between">
                            <Heading size="sm" color="brand.100">
                                {vehicle.name}
                            </Heading>
                            {Boolean(getOverdueRemindersCount(vehicle)) && (
                                <NumberBadge sentiment="negative">
                                    {getOverdueRemindersCount(vehicle)}
                                </NumberBadge>
                            )}
                        </Flex>
                        <HStack color="whiteAlpha.700" divider={<Interpunct fontSize="sm" />}>
                            {Boolean(vehicle.estimatedMileage) && (
                                <Text fontSize="sm">
                                    {formatEstimatedMileage(vehicle)}
                                </Text>
                            )}
                            {Boolean(vehicle.milesPerYear) && (
                                <Text fontSize="sm">
                                    {formatMilesPerYear(vehicle)}
                                    /yr
                                </Text>
                            )}
                        </HStack>
                    </Flex>
                </LinkOverlay>
            </NextLink>
        </LinkBox>
    );
};

export default VehicleItem;
