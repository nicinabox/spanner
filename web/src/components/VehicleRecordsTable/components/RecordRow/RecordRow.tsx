import { Box, Text } from '@chakra-ui/react';
import LinkButton from 'components/common/LinkButton';
import { Cell, Row } from 'components/VehicleRecordsTable/VehicleRecordsTable';
import { intlFormat } from 'date-fns';
import useInlineColorMode from 'hooks/useInlineColorMode';
import usePageContext from 'hooks/usePageContext';
import { marked } from 'marked';
import { recordAPIPath } from 'queries/records';
import React from 'react';
import { mutate } from 'swr';
import { parseDateUTC } from 'utils/date';
import { formatCurrency } from 'utils/number';
import { editRecordPath } from 'utils/resources';
import { formatMileage } from 'utils/vehicle';

export interface RecordRowProps {
    vehicleId: string;
    record: API.Record;
    distanceUnit?: API.DistanceUnit;
    preferences?: API.VehiclePreferences;
    deltaMileage: number | undefined;
    index: number;
}

export const RecordRow: React.FC<RecordRowProps> = ({
    record,
    vehicleId,
    deltaMileage,
    preferences = {},
    distanceUnit = 'mi',
    index,
}) => {
    const cm = useInlineColorMode();
    const { isShared } = usePageContext();
    const { enableCost = false } = preferences;

    return (
        <Row
            px={4}
            bg={index % 2 ? 'transparent' : cm('gray.50', 'blackAlpha.400')}
        >
            <Cell
                whiteSpace="nowrap"
                fontWeight={['bold', null, 'inherit']}
                fontSize={['sm', null, 'md']}
                mr={[3, null, 'auto']}
            >
                {intlFormat(parseDateUTC(record.date), {
                    month: 'short',
                    day: 'numeric',
                })}
            </Cell>

            <Cell
                whiteSpace="nowrap"
                alignItems="center"
                textAlign={['left', null, 'right']}
                flex={[1, null, 'auto']}
                fontSize={['sm', null, 'md']}
            >
                {Boolean(Number(record.mileage)) &&
                    formatMileage(record.mileage, distanceUnit)}
                {deltaMileage !== undefined && (
                    <Text
                        fontSize="xs"
                        color={cm('blackAlpha.600', 'whiteAlpha.600')}
                        ml={1}
                    >
                        (+
                        {deltaMileage})
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
                <Box
                    sx={{
                        ul: {
                            marginLeft: 'var(--chakra-space-4)',
                        },
                    }}
                    dangerouslySetInnerHTML={{ __html: marked(record.notes) }}
                />
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
                            mutate(
                                recordAPIPath(vehicleId, record.id),
                                record,
                                false,
                            );
                        }}
                    >
                        Edit
                    </LinkButton>
                )}
            </Cell>
        </Row>
    );
};

export default RecordRow;
