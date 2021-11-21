import { useMemo } from 'react';
import Bugsnag from 'utils/bugsnag';

export default function useBuildId() {
    return useMemo(() => {
        try {
            const content = document.querySelector('#__NEXT_DATA__')?.textContent;
            if (content) {
                return JSON.parse(content).buildId;
            }
            return undefined;
        } catch (e) {
            Bugsnag.notify(e);
            return undefined;
        }
    }, []);
}
