import React from 'react';
import NextLink from 'next/link';
import { Box, Button, Flex, Heading, HStack, Link, LinkBox, LinkOverlay, Spacer, Text, useStyleConfig } from '@chakra-ui/react';
import Interpunct from 'components/Interpunct';
import { Vehicle } from 'queries/vehicles';
import { formatEstimatedMileage, formatMilesPerYear } from 'utils/vehicle';
import VehicleColorIndicator from 'components/VehicleColorIndicator';

export interface VehicleItemProps {
    vehicle: Vehicle;
}

export const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle}) => {
    const styles = useStyleConfig('VehicleItem');

    return (
        <LinkBox sx={styles}>
            <NextLink href={`/vehicles/${vehicle.id}`} passHref>
                <LinkOverlay>
                    <Flex>
                        <VehicleColorIndicator color={vehicle.color} size={5} />
                        <Spacer maxW={2} />
                        <Flex direction="column" minH={12}>
                            <HStack spacing={2}>
                                <Heading size="sm" color="brand.100">
                                    {vehicle.name}
                                </Heading>
                            </HStack>
                            <HStack divider={<Interpunct color="brand.300" fontSize="sm" />}>
                                {Boolean(vehicle.estimatedMileage) && (
                                    <Text color="brand.300" fontSize="sm">
                                        ~{formatEstimatedMileage(vehicle)}
                                    </Text>
                                )}
                                {Boolean(vehicle.milesPerYear) && (
                                    <Text color="brand.300" fontSize="sm">
                                        {formatMilesPerYear(vehicle)}/yr
                                    </Text>
                                )}
                            </HStack>
                        </Flex>
                    </Flex>
                </LinkOverlay>
            </NextLink>
        </LinkBox>
    )
};

export default VehicleItem;
