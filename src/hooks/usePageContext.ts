import { useContext } from 'react';
import { PageContext } from 'components/common/Page';

export default function usePageContext() {
    return useContext(PageContext);
}
