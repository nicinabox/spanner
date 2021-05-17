import React from 'react';

import { render } from '@testing-library/react';

import MarkdownBody from '.';

describe('MarkdownBody', () => {
    it('renders markdown to html', () => {
        const props = {
            body: '# Hello World',
        };
        const { container } = render(<MarkdownBody {...props} />);
        expect(container).toMatchSnapshot();
    });
});
