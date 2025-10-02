import { Flex, Skeleton, SkeletonText } from '@chakra-ui/react';
import { groupBy } from 'lodash';
import React, { useMemo } from 'react';
import { sortRecordsNewestFirst } from 'utils/vehicle';
import RecordGroup from './components/RecordGroup';

export interface VehicleRecordsTableProps {
    records: API.Record[] | undefined;
    vehicleId: string;
    preferences?: API.VehiclePreferences;
    distanceUnit?: API.DistanceUnit;
    isLoaded?: boolean;
}

export const VehicleRecordsTable: React.FC<VehicleRecordsTableProps> = ({
    records,
    ...props
}) => {
    const recordsNewestFirst = useMemo(
        () => sortRecordsNewestFirst(records ?? []),
        [records],
    );
    const recordsByYear = useMemo(
        () =>
            groupBy(recordsNewestFirst, (r) => new Date(r.date).getFullYear()),
        [recordsNewestFirst],
    );
    const years = Object.keys(recordsByYear).sort(
        (a, b) => Number(b) - Number(a),
    );

    if (!records) {
        return (
            <FlexTable>
                {[1, 2, 3].map((n) => (
                    <Row key={n} data-testid={`skeleton${n}`}>
                        <Cell mr={[3, null, 'auto']}>
                            <Skeleton h={2} w={100} />
                        </Cell>
                        <Cell flex={[1, null, 'auto']}>
                            <Skeleton h={2} w={100} />
                        </Cell>
                        <Cell pt={[2]} basis={['100%', null]} w="100%">
                            <SkeletonText noOfLines={2} flex={1} />
                        </Cell>
                    </Row>
                ))}
            </FlexTable>
        );
    }

    return (
        <>
            {years.map((year) => {
                return (
                    <RecordGroup
                        key={year}
                        heading={year}
                        recordsNewestFirst={recordsNewestFirst}
                        records={recordsByYear[year]}
                        {...props}
                    />
                );
            })}
        </>
    );
};

export const Row = (props) => {
    return (
        <Flex
            py={[2, null, 0]}
            display={['flex', null, 'table-row']}
            flexFlow={['wrap', null, 'nowrap']}
            alignItems="flex-start"
            {...props}
        />
    );
};

export const Cell = (props) => (
    <Flex
        px={[0, null, 4]}
        py={[0, null, 2]}
        display={['flex', null, 'table-cell']}
        verticalAlign="top"
        alignItems="flex-start"
        {...props}
    />
);

export const FlexTable = (props) => (
    <Flex
        w="100%"
        direction="column"
        flexFlow="column nowrap"
        display={['flex', null, 'table']}
        {...props}
    />
);

export default VehicleRecordsTable;
