import { useEffect, useState } from 'react';

export default function useSearchQuery<T>(
    initialResults: T[] | undefined,
    filterFn: (result: T, searchQuery: string) => boolean,
) {
    const [searchQuery, setSearchQuery] = useState('');
    const [queryResults, setQueryResults] = useState(initialResults ?? []);

    useEffect(() => {
        if (!initialResults?.length) return;

        if (!searchQuery) {
            setQueryResults(initialResults);
            return;
        }

        const nextResults = initialResults?.filter((item) =>
            filterFn(item, searchQuery),
        );
        setQueryResults(nextResults ?? []);
    }, [searchQuery, initialResults]);

    return {
        setSearchQuery,
        searchQuery,
        queryResults,
    };
}
