import { mode } from '@chakra-ui/theme-tools';

const variantGhostHeader = (props) => {
    return {
        color: mode('whiteAlpha.900', 'whiteAlpha.900')(props),
        _hover: {
            bg: mode('blackAlpha.400', 'blackAlpha.400')(props),
        },
        _active: { bg: mode('blackAlpha.400', 'blackAlpha.400')(props) },
    };
};

export default {
    variants: {
        'ghost-header': variantGhostHeader,
    },
};
