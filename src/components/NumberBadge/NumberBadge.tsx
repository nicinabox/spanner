import { Circle, SquareProps } from '@chakra-ui/react';
import React from 'react';

export type BadgeSentiment = 'neutral' | 'warning' | 'negative';

export interface NumberBadgeProps extends SquareProps {
    sentiment?: BadgeSentiment
}

const getBadgeBg = (sentiment: BadgeSentiment | undefined) => {
    if (sentiment === 'warning') return 'orange.300';
    if (sentiment === 'negative') return 'red.400';
    return 'brand.200';
};

export const NumberBadge: React.FC<NumberBadgeProps> = ({ children, sentiment, ...circleProps }) => {
    return (
        <Circle
            minW={5}
            px={2}
            bg={getBadgeBg(sentiment)}
            color="white"
            shadow="sm"
            fontSize="xs"
            fontWeight="900"
            {...circleProps}
        >
            {children}
        </Circle>
    );
};

export default NumberBadge;
