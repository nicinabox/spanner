import React from 'react';
import NextLink from 'next/link';
import { Box, Flex, Heading, HStack, Link, Text } from '@chakra-ui/react';
import Interpunct from 'components/Interpunct';
import { Vehicle } from 'queries/vehicles';
import { formatNumber } from 'utils/number';

export interface VehicleItemProps {
    vehicle: Vehicle;
}

export const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle }) => {
    return (
        <NextLink href={`/vehicles/${vehicle.id}`} passHref>
            <Link display="block">
                <Box key={vehicle.id} bg="brand.primary" p={5} borderRadius={6}>
                    <Flex direction="column" minH={12}>
                        <Heading size="sm" color="brand.100">
                            {vehicle.name}
                        </Heading>
                        <HStack divider={<Interpunct color="brand.300" fontSize="sm" />}>
                            {Boolean(vehicle.estimatedMileage) && (
                                <Text color="brand.300" fontSize="sm">
                                    ~{formatNumber(vehicle.estimatedMileage)} {vehicle.distanceUnit}
                                </Text>
                            )}
                            {Boolean(vehicle.milesPerYear) && (
                                <Text color="brand.300" fontSize="sm">
                                    {formatNumber(vehicle.milesPerYear)} {vehicle.distanceUnit}/yr
                                </Text>
                            )}
                        </HStack>
                    </Flex>
                </Box>
            </Link>
        </NextLink>
    )
};

export default VehicleItem;
