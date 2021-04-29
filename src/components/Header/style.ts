import { mode } from '@chakra-ui/theme-tools';
import theme from 'theme';

export default {
    baseStyle: (props) => ({
        mb: 6,
        p: 2,
        positon: 'sticky',
        top: 0,
        zIndex: theme.zIndices.sticky,
        bg: mode(`${props.colorScheme}.primary`, `${props.colorScheme}.900`)(props),
    }),
    defaultProps: {
        colorScheme: 'brand',
    },
};
