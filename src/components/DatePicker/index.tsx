import { Box, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

export interface DatePickerProps {
    onChange?: (date: Date) => void;
    initialDate?: Date
}

export const DatePicker: React.FC<DatePickerProps> = ({ initialDate = new Date(), onChange = () => {} }) => {
    const [selectedDay, setSelectedDay] = useState(initialDate);

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
        '.DayPicker-Day--today': {
            color: todayColor
        }
    }

    const onDayClick = (date: Date) => {
        setSelectedDay(date);
        onChange(date);
    }

    return (
        <Box lineHeight={1.2} sx={styles}>
            <DayPicker onDayClick={onDayClick} initialMonth={initialDate} selectedDays={selectedDay} />
        </Box>
    );
};

export default DatePicker;
