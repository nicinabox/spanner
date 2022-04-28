import {
    Box, Input, useColorModeValue, useDisclosure,
} from '@chakra-ui/react';
import { intlFormat } from 'date-fns';
import useInlineColorMode from 'hooks/useInlineColorMode';
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export interface DatePickerProps {
    onChange?: (date: Date) => void;
    initialDate?: Date
}

export const DatePicker: React.FC<DatePickerProps> = ({ initialDate = new Date(), onChange }) => {
    const [selectedDay, setSelectedDay] = useState(initialDate);
    const { isOpen, onToggle } = useDisclosure();

    const cm = useInlineColorMode();

    const sx = {
        '.rdp': {
            margin: '1rem 0',
        },
        caption: {
            fontSize: 'var(--chakra-fontSizes-sm)',
        },
        '--rdp-background-color': cm('colors.blackAlpha.200', 'colors.blackAlpha.400'),
        '--rdp-accent-color': cm('colors.brand.500', 'colors.brand.500'),

        '--rdp-outline': '2px solid var(--chakra-colors-blue-500)',
        '--rdp-outline-selected': `2px solid var(${cm('--chakra-colors-blackAlpha-500', '--chakra-colors-whiteAlpha-400')})`,
    };

    const onDayClick = (date: Date) => {
        setSelectedDay(date);
        onChange?.(date);
    };

    const formatSelectedDate = () => {
        return intlFormat(selectedDay, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <>
            <Input value={formatSelectedDate()} readOnly onClick={onToggle} />
            <Box lineHeight={1.2} display={[isOpen ? 'block' : 'none', 'block']} sx={sx}>
                <DayPicker
                    onDayClick={onDayClick}
                    defaultMonth={initialDate}
                    selected={selectedDay}
                    fixedWeeks
                />
            </Box>
        </>
    );
};

export default DatePicker;
