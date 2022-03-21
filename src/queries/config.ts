import axios, { AxiosRequestConfig } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import qs from 'qs';

export type MutateParams<T extends { id?: API.RecordID }> = T & Required<Pick<T, 'id'>>

// eslint-disable-next-line prefer-destructuring
const PROXY_HOST = process.env.PROXY_HOST;
const API_VERSION = 2;

const paramsSerializer = (params) => {
    return qs.stringify(params, { arrayFormat: 'brackets' });
};

const getTimeZoneOffset = () => {
    return (new Date().getTimezoneOffset() / 60) * -1;
};

export const createAPIRequest = (req?) => {
    let api;

    if (req) {
        const session = req.session.get('session');
        const Authorization = session ? `Token ${session.authToken}` : null;

        api = axios.create({
            baseURL: PROXY_HOST,
            paramsSerializer,
            headers: {
                Accept: `application/vnd.api+json; version=${API_VERSION}`,
                'Time-Zone-Offset': getTimeZoneOffset(),
                Authorization,
            },
        });

        api.interceptors.request.use((config: AxiosRequestConfig) => {
            // eslint-disable-next-line no-param-reassign
            config.url = config.url?.replace(/^\/api/, '');
            return config;
        });
    } else {
        api = axios.create({
            paramsSerializer,
            headers: {
                'Time-Zone-Offset': getTimeZoneOffset(),
            },
        });
    }

    return applyCaseMiddleware(api);
};

export const clientAPI = createAPIRequest();
