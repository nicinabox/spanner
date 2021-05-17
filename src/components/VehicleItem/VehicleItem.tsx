import React from 'react';
import NextLink from 'next/link';
import {
    Box, Button, Flex, Heading, HStack, Link, LinkBox, LinkOverlay, Spacer, Text, useStyleConfig,
} from '@chakra-ui/react';
import Interpunct from 'components/common/Interpunct';
import { Vehicle } from 'queries/vehicles';
import { formatEstimatedMileage, formatMilesPerYear } from 'utils/vehicle';
import { getOverdueRemindersCount } from 'utils/reminders';
import NumberBadge from 'components/common/NumberBadge';

export interface VehicleItemProps {
    vehicle: Vehicle;
}

export const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle }) => {
    const styles = useStyleConfig('VehicleItem');

    return (
        <LinkBox sx={styles}>
            <NextLink href={`/vehicles/${vehicle.id}`} passHref>
                <LinkOverlay>
                    <Flex direction="column" minH={12}>
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
                        <HStack divider={<Interpunct color="brand.300" fontSize="sm" />}>
                            {Boolean(vehicle.estimatedMileage) && (
                                <Text color="brand.300" fontSize="sm">
                                    ~
                                    {formatEstimatedMileage(vehicle)}
                                </Text>
                            )}
                            {Boolean(vehicle.milesPerYear) && (
                                <Text color="brand.300" fontSize="sm">
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
