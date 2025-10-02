import { extendTheme } from '@chakra-ui/react';
import Header from 'components/common/Header/style';
import VehicleItem from 'components/VehicleItem/style';

import Button from './components/Button';

const brandShades = {
    50: '#ECEBF4',
    100: '#eeeef5',
    200: '#d5d4e5',
    300: '#bbb9d5',
    400: '#8985b6',
    500: '#565196',
    600: '#4d4987',
    700: '#413d71',
    800: '#34315a',
    900: '#2a284a',
};

const shades = Object.keys(brandShades);
const invertedBrandShades = Object.values(brandShades)
    .reverse()
    .reduce((acc, value, i) => ({ ...acc, [shades[i]]: value }), {});

export const colors = {
    brand: {
        primary: brandShades[500],
        ...brandShades,
    },
    brandInverted: {
        primary: brandShades[400],
        ...invertedBrandShades,
    },
};

export default extendTheme({
    colors,
    styles: {
        global: (props) => ({
            body: {
                backgroundColor:
                    props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
            },
        }),
    },
    config: {
        initialColorMode: 'system',
        useSystemColorMode: false,
    },
    fonts: {
        heading: 'Lato',
        body: 'Lato',
    },
    components: {
        Header,
        VehicleItem,
        Button,
    },
});
