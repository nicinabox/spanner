import { extendTheme } from '@chakra-ui/react';
import Header from 'components/Header/style';
import VehicleItem from 'components/VehicleItem/style';

export const colors = {
    brand: {
        primary: '#565196',

        50: '#f7f6fa',
        100: '#eeeef5',
        200: '#d5d4e5',
        300: '#bbb9d5',
        400: '#8985b6',
        500: '#565196',
        600: '#4d4987',
        700: '#413d71',
        800: '#34315a',
        900: '#2a284a',
    },
};

export default extendTheme({
    colors,
    initialColorMode: 'system',
    useSystemColorMode: true,
    fonts: {
        heading: 'Lato',
        body: 'Lato',
    },
    components: {
        Header,
        VehicleItem,
    },
});
