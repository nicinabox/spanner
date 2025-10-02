import Bugsnag, { Client } from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

// eslint-disable-next-line
let bugsnagClient: Client | undefined;

if (process.env.BUGSNAG_API_KEY) {
    bugsnagClient = Bugsnag.start({
        apiKey: process.env.BUGSNAG_API_KEY,
        plugins: [new BugsnagPluginReact()],
        enabledReleaseStages: ['production'],
    });
}

export default bugsnagClient;
