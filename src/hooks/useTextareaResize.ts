import { useCallback, useRef } from 'react';

export default function useTextareaResize() {
    const ref = useRef(null);

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
        // eslint-disable-next-line no-param-reassign
        node.style.height = `${node.scrollHeight}px`;
    };

    return measuredRef;
}
