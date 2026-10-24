import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import SplitButton from './SplitButton.svelte';

const children = createRawSnippet(() => ({
	render: () => `<span>New Task</span>`,
}));

describe('SplitButton', () => {
	it('forwards extra attributes to the trigger button', async () => {
		const { container } = await render(SplitButton, {
			items: [{ value: 'a', label: 'A' }],
			children,
			'data-umami-event': 'add_task',
		} as never);

		const button = container.querySelector('button');
		expect(button?.getAttribute('data-umami-event')).toBe('add_task');
	});
});
