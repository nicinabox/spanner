import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import InputGroup from './InputGroup.svelte';

describe('InputGroup', () => {
	it('renders input with start slot', async () => {
		const { container } = render(InputGroup, {
			name: 'test',
			placeholder: 'Search...',
			start: createRawSnippet(() => ({ render: () => '🔍' })),
		});

		const input = container.querySelector('input');
		expect(input).toBeTruthy();
		expect(input?.getAttribute('placeholder')).toBe('Search...');
	});

	it('renders input with end slot', async () => {
		const { container } = render(InputGroup, {
			name: 'test',
			end: createRawSnippet(() => ({ render: () => '✕' })),
		});

		const input = container.querySelector('input');
		expect(input).toBeTruthy();
	});

	it('renders input with both start and end slots', async () => {
		const { container } = render(InputGroup, {
			name: 'test',
			start: createRawSnippet(() => ({ render: () => '🔍' })),
			end: createRawSnippet(() => ({ render: () => '✕' })),
		});

		const input = container.querySelector('input');
		expect(input).toBeTruthy();
	});

	it('renders with startAddon', async () => {
		const { container } = render(InputGroup, {
			name: 'test',
			startAddon: createRawSnippet(() => ({ render: () => '$' })),
		});

		const input = container.querySelector('input');
		expect(input).toBeTruthy();
	});

	it('renders with endAddon', async () => {
		const { container } = render(InputGroup, {
			name: 'test',
			endAddon: createRawSnippet(() => ({ render: () => 'kg' })),
		});

		const input = container.querySelector('input');
		expect(input).toBeTruthy();
	});

	it('renders standalone (no slots)', async () => {
		const { container } = render(InputGroup, {
			name: 'test',
			placeholder: 'Enter text',
		});

		const input = container.querySelector('input');
		expect(input).toBeTruthy();
		expect(input?.getAttribute('placeholder')).toBe('Enter text');
	});

	it('forwards input attributes', async () => {
		const { container } = render(InputGroup, {
			name: 'test',
			type: 'search',
			placeholder: 'Search...',
			disabled: true,
			readonly: true,
			autocomplete: 'off',
			inputmode: 'search',
		});

		const input = container.querySelector('input')!;
		expect(input.getAttribute('type')).toBe('search');
		expect(input.getAttribute('placeholder')).toBe('Search...');
		expect(input.hasAttribute('disabled')).toBe(true);
		expect(input.hasAttribute('readonly')).toBe(true);
		expect(input.getAttribute('autocomplete')).toBe('off');
		expect(input.getAttribute('inputmode')).toBe('search');
	});

	it('binds value', async () => {
		const { container } = render(InputGroup, {
			name: 'test',
			value: 'initial',
		});

		const input = container.querySelector('input')!;
		expect(input.value).toBe('initial');
	});

	it('focuses input when clicking start element', async () => {
		const { container } = render(InputGroup, {
			name: 'test',
			start: createRawSnippet(() => ({ render: () => '🔍' })),
		});

		const input = container.querySelector('input')!;
		const outer = container.firstElementChild as HTMLElement;
		const inlineWrapper = outer.firstElementChild as HTMLElement;
		const startEl = inlineWrapper.firstElementChild as HTMLElement;

		startEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
		expect(document.activeElement).toBe(input);
	});

	it('focuses input when clicking end element', async () => {
		const { container } = render(InputGroup, {
			name: 'test',
			end: createRawSnippet(() => ({ render: () => '✕' })),
		});

		const input = container.querySelector('input')!;
		const outer = container.firstElementChild as HTMLElement;
		const inlineWrapper = outer.firstElementChild as HTMLElement;
		const endEl = inlineWrapper.lastElementChild as HTMLElement;

		endEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
		expect(document.activeElement).toBe(input);
	});
});
