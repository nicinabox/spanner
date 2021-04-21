import React from 'react';
import NextLink from 'next/link';
import { Box, Button, Flex, Heading, HStack, Link, Text } from '@chakra-ui/react';
import Interpunct from 'components/Interpunct';
import { Vehicle } from 'queries/vehicles';
import { formatEstimatedMileage, formatMilesPerYear } from 'utils/vehicle';

export interface VehicleItemProps {
    vehicle: Vehicle;
}

export const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle }) => {
    return (
        <NextLink href={`/vehicles/${vehicle.id}`} passHref>
            <Button as="a" display="block" colorScheme="brand" p={5} borderRadius={6} height="auto">
                <Flex direction="column" minH={12}>
                    <Heading size="sm" color="brand.100">
                        {vehicle.name}
                    </Heading>
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
            </Button>
        </NextLink>
    )
};

export default VehicleItem;
