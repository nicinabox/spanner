import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Box, Button, Flex, Heading, Skeleton, SkeletonText, Text, Tooltip, useDisclosure,
} from '@chakra-ui/react';
import LinkButton from 'components/common/LinkButton';
import { intlFormat } from 'date-fns';
import useInlineColorMode from 'hooks/useInlineColorMode';
import { mutate } from 'hooks/useMutation';
import usePageContext from 'hooks/usePageContext';
import { capitalize, groupBy } from 'lodash';
import { VehicleRecord, recordAPIPath } from 'queries/records';
import { DistanceUnit, VehiclePreferences } from 'queries/vehicles';
import React, { useEffect } from 'react';
import { parseDateUTC } from 'utils/date';
import lang from 'utils/lang';
import { formatCurrency } from 'utils/number';
import { editRecordPath } from 'utils/resources';
import { formatMileage, sortRecordsNewestFirst } from 'utils/vehicle';

export interface VehicleRecordsTableProps {
    records: VehicleRecord[] | undefined;
    vehicleId: string;
    preferences?: VehiclePreferences;
    distanceUnit?: DistanceUnit;
    isLoaded?: boolean;
}

const getNextRecordWithMileage = (record: VehicleRecord, arr: VehicleRecord[]): VehicleRecord | undefined => {
    const idx = arr.findIndex((r) => r.id === record.id);
    return arr[idx + 1];
};

const getDeltaMileage = (record: VehicleRecord, olderRecord: VehicleRecord): number | undefined => {
    if (!record.mileage) return undefined;
    return record.mileage - olderRecord.mileage;
};

const Row = (props) => {
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

const Cell = (props) => (
    <Flex
        px={[0, null, 4]}
        py={[0, null, 2]}
        display={['flex', null, 'table-cell']}
        verticalAlign="top"
        alignItems="flex-start"
        {...props}
    />
);

const FlexTable = (props) => (
    <Flex
        w="100%"
        direction="column"
        flexFlow="column nowrap"
        display={['flex', null, 'table']}
        {...props}
    />
);

export const VehicleRecordsTable: React.FC<VehicleRecordsTableProps> = ({
    records, vehicleId, preferences = {}, distanceUnit = 'mi',
}) => {
    const { isShared } = usePageContext();

    const reverseChronoRecords = sortRecordsNewestFirst(records ?? []);
    const recordsByYear = groupBy(reverseChronoRecords, (r) => new Date(r.date).getFullYear());
    const years = Object.keys(recordsByYear).sort((a, b) => Number(b) - Number(a));
    const { enableCost = false } = preferences;

    const {
        isOpen: showMileageAdjustmentRecords, onToggle: onToggleShowMileageAdjustment, onOpen, onClose,
    } = useDisclosure({
        defaultIsOpen: preferences.showMileageAdjustmentRecords ?? true,
    });

    useEffect(() => {
        const goToState = preferences.showMileageAdjustmentRecords ? onOpen : onClose;
        goToState();
    }, [preferences.showMileageAdjustmentRecords]);

    const cm = useInlineColorMode();

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
                const allYearRecords = recordsByYear[year];
                const filteredRecords = allYearRecords.filter((r) => r.recordType !== 'mileage adjustment');
                const omittedCount = allYearRecords.length - filteredRecords.length;

                const yearRecords = showMileageAdjustmentRecords ? allYearRecords : filteredRecords;

                return (
                    <Box key={year} shadow={['sm', 'md', 'md']} mx={[-4, 0]} bg={cm('white', 'whiteAlpha.200')}>
                        <Heading
                            borderBottomWidth={1}
                            borderBottomColor={cm('gray.200', 'whiteAlpha.200')}
                            size="md"
                            px={4}
                            py={3}
                        >
                            <Flex justifyContent="space-between" align="center">
                                {year}
                                {!preferences.showMileageAdjustmentRecords && Boolean(omittedCount) && (
                                    <Tooltip label={`${omittedCount} records ${showMileageAdjustmentRecords ? 'visible' : 'hidden'}`}>
                                        <Button rightIcon={showMileageAdjustmentRecords ? <ViewIcon /> : <ViewOffIcon />} size="xs" onClick={onToggleShowMileageAdjustment}>
                                            {omittedCount}
                                        </Button>
                                    </Tooltip>
                                )}
                            </Flex>
                        </Heading>

                        <FlexTable mb={8} pb={2}>
                            <Row
                                fontWeight="bold"
                                fontSize="xs"
                                color={cm('blackAlpha.600', 'whiteAlpha.600')}
                                borderBottomColor={cm('gray.300', 'whiteAlpha.800')}
                                display={['none', null, 'table-row']}
                                textTransform="uppercase"
                            >
                                <Cell>Date</Cell>
                                <Cell whiteSpace="nowrap">{capitalize(lang.mileageLabel[distanceUnit])}</Cell>
                                {enableCost && <Cell>Cost</Cell>}
                                <Cell>Notes</Cell>
                                <Cell />
                            </Row>

                            {yearRecords.map((record, i) => {
                                const nextRecord = getNextRecordWithMileage(record, reverseChronoRecords);
                                const deltaMileage = nextRecord ? getDeltaMileage(record, nextRecord) : undefined;

                                return (
                                    <Row
                                        key={record.id}
                                        px={4}
                                        bg={i % 2 ? 'transparent' : cm('gray.50', 'blackAlpha.400')}
                                    >
                                        <Cell
                                            whiteSpace="nowrap"
                                            fontWeight={['bold', null, 'inherit']}
                                            fontSize={['sm', null, 'md']}
                                            mr={[3, null, 'auto']}
                                        >
                                            {intlFormat(parseDateUTC(record.date), { month: 'short', day: 'numeric' })}
                                        </Cell>

                                        <Cell
                                            whiteSpace="nowrap"
                                            alignItems="center"
                                            textAlign={['left', null, 'right']}
                                            flex={[1, null, 'auto']}
                                            fontSize={['sm', null, 'md']}
                                        >
                                            {Boolean(Number(record.mileage)) && formatMileage(record.mileage, distanceUnit)}
                                            {deltaMileage !== undefined && (
                                                <Text fontSize="xs" color={cm('blackAlpha.600', 'whiteAlpha.600')} ml={1}>
                                                    (+
                                                    {deltaMileage}
                                                    )
                                                </Text>
                                            )}
                                        </Cell>

                                        {enableCost && (
                                            <Cell
                                                whiteSpace="nowrap"
                                                fontSize={['sm', null, 'md']}
                                                textAlign="right"
                                            >
                                                {record.cost ? formatCurrency(Number(record.cost)) : '--'}
                                            </Cell>
                                        )}

                                        <Cell basis={['100%', null]} w="100%" py={[1, 2]}>
                                            {record.notes}
                                        </Cell>

                                        <Cell justify="end" basis="100%">
                                            {!isShared && (
                                                <LinkButton
                                                    href={editRecordPath(vehicleId, record.id)}
                                                    size="sm"
                                                    variant="link"
                                                    py={[1, null]}
                                                    onClick={() => {
                                                        // Preload data for edit form
                                                        mutate(recordAPIPath(vehicleId, record.id), record, false);
                                                    }}
                                                >
                                                    Edit
                                                </LinkButton>
                                            )}
                                        </Cell>
                                    </Row>
                                );
                            })}
                        </FlexTable>
                    </Box>
                );
            })}
        </>
    );
};

export default VehicleRecordsTable;
