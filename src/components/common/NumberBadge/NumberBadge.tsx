import { Circle, SquareProps, useColorModeValue } from '@chakra-ui/react';
import useInlineColorMode from 'hooks/useInlineColorMode';
import React from 'react';

export type BadgeSentiment = 'neutral' | 'warning' | 'negative';

export interface NumberBadgeProps extends SquareProps {
    sentiment?: BadgeSentiment
}

const getBadgeColors = (sentiment: BadgeSentiment | undefined, cm) => {
    if (sentiment === 'warning') {
        return {
            bg: 'orange.300',
            color: 'white',
        };
    }

    if (sentiment === 'negative') {
        return {
            bg: cm('red.500', 'red.600'),
            color: cm('brand.900', 'white'),
        };
    }

    return {
        bg: cm('brand.200', 'brand.900'),
        color: 'white',
    };
};

export const NumberBadge: React.FC<NumberBadgeProps> = ({ children, sentiment, ...circleProps }) => {
    const cm = useInlineColorMode();
    const colors = getBadgeColors(sentiment, cm);

    return (
        <Circle
            minW={5}
            px={2}
            shadow="sm"
            fontSize="xs"
            fontWeight="900"
            {...colors}
            {...circleProps}
        >
            {children}
        </Circle>
    );
};

export default NumberBadge;
