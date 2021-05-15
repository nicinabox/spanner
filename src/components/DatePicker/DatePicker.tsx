import {
    Box, Input, useColorModeValue, useDisclosure,
} from '@chakra-ui/react';
import { intlFormat } from 'date-fns';
import React, { useState } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

export interface DatePickerProps {
    onChange?: (date: Date) => void;
    initialDate?: Date
}

export const DatePicker: React.FC<DatePickerProps> = ({ initialDate = new Date(), onChange }) => {
    const [selectedDay, setSelectedDay] = useState(initialDate);
    const { isOpen, onToggle } = useDisclosure();

    const hoverBg = useColorModeValue('brand.100', 'brand.900');
    const selectedBg = useColorModeValue('brand.primary', 'brand.100');
    const selectedColor = useColorModeValue('white', 'black');
    const todayColor = useColorModeValue('cyan.500', 'cyan.500');

    const styles = {
        '.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)': {
            backgroundColor: selectedBg,
            color: selectedColor,
        },
        '.DayPicker:not(.DayPicker--interactionDisabled) .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover': {
            backgroundColor: hoverBg,
        },
        '.DayPicker-Day': {
            w: '2rem',
            h: '2rem',
            borderRadius: 6,
        },
        '.DayPicker-Day--today': {
            color: todayColor,
        },
        '.DayPicker-wrapper': {
            p: 0,
            w: '100%',
        },
        '.DayPicker-Month': {
            mx: 0,
            w: '100%',
            maxW: 300,
        },
        '.DayPicker-Caption > div': {
            fontSize: 'sm',
            fontWeight: 'bold',
        },
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
            <Box lineHeight={1.2} sx={styles}>
                {isOpen && (
                    <DayPicker
                        onDayClick={onDayClick}
                        initialMonth={initialDate}
                        selectedDays={selectedDay}
                        fixedWeeks
                    />
                )}
            </Box>
        </>
    );
};

export default DatePicker;
