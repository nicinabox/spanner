import React from 'react';
import {
    Stat as ChakraStat,
    Text,
    StatLabel,
    StatNumber,
} from '@chakra-ui/react';
import Link from 'next/link';
import lang from 'utils/lang';
import { formatEstimatedMileage, formatMilesPerYear } from 'utils/vehicle';
import { formatDuration, intervalToDuration, intlFormat } from 'date-fns';
import { parseDateUTC } from 'utils/date';
import { editVehiclePath } from 'utils/resources';
import { capitalize } from 'lodash';

export const Stat = ({ label, children, ...props }) => (
    <ChakraStat minW="max-content" {...props}>
        <StatLabel color="gray.500">{label}</StatLabel>
        <StatNumber fontSize={['lg', null, 'x-large']}>{children}</StatNumber>
    </ChakraStat>
);

export const EstimatedMileageStat = ({ vehicle }) =>
    vehicle.estimatedMileage && (
        <Stat label={`Estimated ${lang.mileageLabel[vehicle.distanceUnit]}`}>
            {formatEstimatedMileage(vehicle)}
        </Stat>
    );

export const YearlyMileageStat = ({ vehicle }) =>
    vehicle.milesPerYear && (
        <Stat
            label={`${capitalize(lang.mileageLabel[vehicle.distanceUnit])} rate`}
        >
            {formatMilesPerYear(vehicle)}
            /yr
        </Stat>
    );

export const SinceStat = ({ oldestRecord }) =>
    oldestRecord && (
        <Stat label="Since">
            {intlFormat(parseDateUTC(oldestRecord?.date), {
                month: 'short',
                year: 'numeric',
                day: 'numeric',
            })}
        </Stat>
    );

export const DurationStat = ({ oldestRecord }) =>
    oldestRecord && (
        <Stat label="Duration">
            {formatDuration(
                intervalToDuration({
                    start: new Date(oldestRecord?.date),
                    end: new Date(),
                }),
                {
                    format: ['years', 'months'],
                },
            )}
        </Stat>
    );

export const VinStat = ({ vehicle, isShared }) => (
    <Stat label="VIN">
        {vehicle.vin ||
            (isShared ? (
                '--'
            ) : (
                <Link href={editVehiclePath(vehicle.id)} passHref>
                    <Text as="a" color="brand.primary">
                        Add VIN...
                    </Text>
                </Link>
            ))}
    </Stat>
);
