import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

Bugsnag.start({
    apiKey: process.env.BUGSNAG_API_KEY as string,
    plugins: [new BugsnagPluginReact()],
    enabledReleaseStages: ['production'],
});
