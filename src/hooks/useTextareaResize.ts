import { useCallback, useRef } from 'react';

export default function useTextareaResize() {
    const ref = useRef<HTMLTextAreaElement | null>(null);

    const measuredRef = useCallback((node) => {
        if (ref.current) {
            ref.current.removeEventListener('input', onInput);
        }

        if (node) {
            setHeight(node);
            node.addEventListener('input', onInput);
            ref.current = node;
        }
    }, []);

    const onInput = (e) => {
        setHeight(e.target);
    };

    const setHeight = (node) => {
        // eslint-disable-next-line no-param-reassign
        node.style.height = 'auto';
        const pb = parseFloat(getComputedStyle(node).paddingBottom);
        // eslint-disable-next-line no-param-reassign
        node.style.height = `${node.scrollHeight + pb}px`;
    };

    return measuredRef;
}
