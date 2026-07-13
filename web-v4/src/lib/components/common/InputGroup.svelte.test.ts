import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import InputGroup from './InputGroup.svelte';
import InputAddon from './InputAddon.svelte';
import Input from './Input.svelte';

describe('InputGroup', () => {
	it('renders a wrapper div with flex layout', () => {
		const { container } = render(InputGroup);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper).toBeTruthy();
		expect(wrapper.tagName).toBe('DIV');
		expect(wrapper.className).toContain('flex');
	});

	it('applies horizontal layout by default (items-center)', () => {
		const { container } = render(InputGroup);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain('items-center');
		expect(wrapper.className).not.toContain('flex-col');
	});

	it('applies vertical layout when orientation is "vertical"', () => {
		const { container } = render(InputGroup, { orientation: 'vertical' });
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain('flex-col');
		expect(wrapper.className).not.toContain('items-center');
	});

	it('applies outline variant by default (visible border)', () => {
		const { container } = render(InputGroup);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain('border');
	});

	it('applies filled variant when specified (bg-ink-200/60)', () => {
		const { container } = render(InputGroup, { variant: 'filled' });
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain('bg-ink-200/60');
	});

	it('forwards class prop to the wrapper', () => {
		const { container } = render(InputGroup, { class: 'w-72' });
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain('w-72');
	});

	it('forwards extra attributes to the wrapper div', () => {
		const { container } = render(InputGroup, { 'data-testid': 'group' });
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.getAttribute('data-testid')).toBe('group');
	});

	it('has focus-within ring styles for accessibility', () => {
		const { container } = render(InputGroup);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain('focus-within:outline-focus-ring');
	});

	it('always sets wrapper h-auto (size controls child Inputs, not the group)', () => {
		const { container } = render(InputGroup, { size: 'lg' });
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain('h-auto');
	});
});

describe('InputAddon', () => {
	it('renders as an inline span', () => {
		const { container } = render(InputAddon);
		const span = container.firstElementChild as HTMLElement;
		expect(span).toBeTruthy();
		expect(span.tagName).toBe('SPAN');
		expect(span.className).toContain('inline-flex');
		expect(span.className).toContain('items-center');
	});

	it('forwards class to the span', () => {
		const { container } = render(InputAddon, { class: 'text-red-500' });
		const span = container.firstElementChild as HTMLElement;
		expect(span.className).toContain('text-red-500');
	});
});
