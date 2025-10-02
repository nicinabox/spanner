import { mode } from '@chakra-ui/theme-tools';

export default {
    baseStyle: (props) => ({
        bg: mode(`${props.colorScheme}.200`, `${props.colorScheme}.600`)(props),
    }),
};
