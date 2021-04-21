import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

const { PROXY_HOST } = process.env;
const API_VERSION = 2;

export const createAPIRequest = (req) => {
    const session = req.session.get('session');
    const Authorization = session ? `Token ${session.authToken}` : null;

    const api = axios.create({
        baseURL: PROXY_HOST,
        headers: {
            Accept: `application/vnd.api+json; version=${API_VERSION}`,
            Authorization,
        }
    })

    return applyCaseMiddleware(api);
}
