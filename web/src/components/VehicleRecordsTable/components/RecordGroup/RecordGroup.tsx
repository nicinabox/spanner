import React, { useEffect } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Flex,
    Heading,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import useInlineColorMode from 'hooks/useInlineColorMode';
import pluralize from 'utils/pluralize';
import { capitalize } from 'lodash';
import lang from 'utils/lang';
import {
    Cell,
    FlexTable,
    Row,
} from 'components/VehicleRecordsTable/VehicleRecordsTable';
import { getDeltaMileage, getNextRecordWithMileage } from 'utils/records';
import { defaultPrefs } from 'queries/vehicles';
import RecordRow from '../RecordRow';

export interface RecordGroupProps {
    records: API.Record[];
    recordsNewestFirst: API.Record[];
    heading: string;
    vehicleId: string;
    preferences?: API.VehiclePreferences;
    distanceUnit?: API.DistanceUnit;
}

export const RecordGroup: React.FC<RecordGroupProps> = ({
    records: recordsProp,
    recordsNewestFirst,
    heading,
    vehicleId,
    preferences = defaultPrefs,
    distanceUnit = 'mi',
}) => {
    const {
        isOpen: showMileageAdjustmentRecords,
        onToggle: onToggleShowMileageAdjustment,
        onOpen,
        onClose,
    } = useDisclosure({
        defaultIsOpen: preferences.showMileageAdjustmentRecords ?? true,
    });

    useEffect(() => {
        const goToState = preferences.showMileageAdjustmentRecords
            ? onOpen
            : onClose;
        goToState();
    }, [preferences.showMileageAdjustmentRecords]);

    const cm = useInlineColorMode();

    const filteredRecords = recordsProp.filter(
        (r) => r.recordType !== 'mileage adjustment',
    );
    const omittedCount = recordsProp.length - filteredRecords.length;
    const records = showMileageAdjustmentRecords
        ? recordsProp
        : filteredRecords;

    const { enableCost = false } = preferences;

    return (
        <Box
            shadow={['sm', 'md', 'md']}
            mx={[-4, 0]}
            bg={cm('white', 'whiteAlpha.200')}
        >
            <Heading
                borderBottomWidth={1}
                borderBottomColor={cm('gray.200', 'whiteAlpha.200')}
                size="md"
                px={4}
                py={3}
            >
                <Flex justifyContent="space-between" align="center">
                    {heading}
                    {!preferences.showMileageAdjustmentRecords &&
                        Boolean(omittedCount) && (
                            <Tooltip
                                label={`${pluralize(omittedCount, 'record')} ${showMileageAdjustmentRecords ? 'visible' : 'hidden'}`}
                            >
                                <Button
                                    rightIcon={
                                        showMileageAdjustmentRecords ? (
                                            <ViewIcon />
                                        ) : (
                                            <ViewOffIcon />
                                        )
                                    }
                                    size="xs"
                                    onClick={onToggleShowMileageAdjustment}
                                >
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
                    <Cell whiteSpace="nowrap">
                        {capitalize(lang.mileageLabel[distanceUnit])}
                    </Cell>
                    {enableCost && <Cell>Cost</Cell>}
                    <Cell>Notes</Cell>
                    <Cell />
                </Row>

                {records.map((record, i) => {
                    const nextRecord = getNextRecordWithMileage(
                        record,
                        recordsNewestFirst,
                    );
                    const deltaMileage = nextRecord
                        ? getDeltaMileage(record, nextRecord)
                        : undefined;

                    return (
                        <RecordRow
                            key={record.id}
                            vehicleId={vehicleId}
                            deltaMileage={deltaMileage}
                            preferences={preferences}
                            record={record}
                            index={i}
                        />
                    );
                })}
            </FlexTable>
        </Box>
    );
};

export default RecordGroup;
