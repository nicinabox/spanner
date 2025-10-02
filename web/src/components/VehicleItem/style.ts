import { mode } from '@chakra-ui/theme-tools';
import theme from 'theme';

export default {
    baseStyle: (props) => ({
        display: 'block',
        p: 5,
        borderRadius: theme.radii.md,
        height: 'auto',
        bg: mode(
            `${props.colorScheme}.primary`,
            `${props.colorScheme}.700`,
        )(props),
        _hover: {
            bg: mode(
                `${props.colorScheme}.700`,
                `${props.colorScheme}.800`,
            )(props),
        },
    }),
    defaultProps: {
        colorScheme: 'brand',
    },
};
