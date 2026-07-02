import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Input from './Input.svelte';

describe('Input', () => {
	it('renders an input element', async () => {
		const { container } = render(Input, { name: 'test' });
		const input = container.querySelector('input');
		expect(input).toBeTruthy();
	});

	it('forwards type attribute', async () => {
		const { container } = render(Input, { name: 'test', type: 'email' });
		const input = container.querySelector('input')!;
		expect(input.getAttribute('type')).toBe('email');
	});

	it('forwards placeholder', async () => {
		const { container } = render(Input, {
			name: 'test',
			placeholder: 'Enter name',
		});
		const input = container.querySelector('input')!;
		expect(input.getAttribute('placeholder')).toBe('Enter name');
	});

	it('forwards disabled', async () => {
		const { container } = render(Input, { name: 'test', disabled: true });
		const input = container.querySelector('input')!;
		expect(input.hasAttribute('disabled')).toBe(true);
	});

	it('forwards readonly', async () => {
		const { container } = render(Input, { name: 'test', readonly: true });
		const input = container.querySelector('input')!;
		expect(input.hasAttribute('readonly')).toBe(true);
	});

	it('forwards autocomplete', async () => {
		const { container } = render(Input, {
			name: 'test',
			autocomplete: 'off',
		});
		const input = container.querySelector('input')!;
		expect(input.getAttribute('autocomplete')).toBe('off');
	});

	it('forwards inputmode', async () => {
		const { container } = render(Input, {
			name: 'test',
			inputmode: 'numeric',
		});
		const input = container.querySelector('input')!;
		expect(input.getAttribute('inputmode')).toBe('numeric');
	});

	it('forwards pattern', async () => {
		const { container } = render(Input, {
			name: 'test',
			pattern: '[0-9]+',
		});
		const input = container.querySelector('input')!;
		expect(input.getAttribute('pattern')).toBe('[0-9]+');
	});

	it('binds initial value', async () => {
		const { container } = render(Input, { name: 'test', value: 'hello' });
		const input = container.querySelector('input')!;
		expect(input.value).toBe('hello');
	});

	it('updates value on input', async () => {
		const { container } = render(Input, { name: 'test', value: '' });
		const input = container.querySelector('input')!;
		input.value = 'new value';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		expect(input.value).toBe('new value');
	});

	it('binds ref', async () => {
		const { container } = render(Input, {
			name: 'test',
		});
		const input = container.querySelector('input')!;
		expect(input).toBeTruthy();
	});

	it('merges custom class', async () => {
		const { container } = render(Input, {
			name: 'test',
			class: 'my-class',
		});
		const input = container.querySelector('input')!;
		expect(input.className).toContain('my-class');
	});

	it('uses name attribute', async () => {
		const { container } = render(Input, { name: 'username' });
		const input = container.querySelector('input')!;
		expect(input.getAttribute('name')).toBe('username');
	});

	it('uses id from field context', async () => {
		const context = new Map();
		context.set('field', {
			id: 'field-id',
			name: 'field-name',
			describedBy: undefined,
			invalid: false,
			required: false,
		});

		const { container } = render(Input, {
			props: { name: 'test' },
			context,
		});
		const input = container.querySelector('input')!;
		expect(input.getAttribute('id')).toBe('field-id');
	});

	it('uses name from field context when no name prop', async () => {
		const context = new Map();
		context.set('field', {
			id: 'field-id',
			name: 'field-name',
			describedBy: undefined,
			invalid: false,
			required: false,
		});

		const { container } = render(Input, {
			props: {},
			context,
		});
		const input = container.querySelector('input')!;
		expect(input.getAttribute('name')).toBe('field-name');
	});

	it('prefers name prop over field context', async () => {
		const context = new Map();
		context.set('field', {
			id: 'field-id',
			name: 'field-name',
			describedBy: undefined,
			invalid: false,
			required: false,
		});

		const { container } = render(Input, {
			props: { name: 'prop-name' },
			context,
		});
		const input = container.querySelector('input')!;
		expect(input.getAttribute('name')).toBe('prop-name');
	});

	it('sets aria-invalid from field context', async () => {
		const context = new Map();
		context.set('field', {
			id: 'test',
			name: 'test',
			describedBy: undefined,
			invalid: true,
			required: false,
		});

		const { container } = render(Input, {
			props: { name: 'test' },
			context,
		});
		const input = container.querySelector('input')!;
		expect(input.getAttribute('aria-invalid')).toBe('true');
	});

	it('sets aria-describedby from field context', async () => {
		const context = new Map();
		context.set('field', {
			id: 'test',
			name: 'test',
			describedBy: 'error-msg',
			invalid: false,
			required: false,
		});

		const { container } = render(Input, {
			props: { name: 'test' },
			context,
		});
		const input = container.querySelector('input')!;
		expect(input.getAttribute('aria-describedby')).toBe('error-msg');
	});

	it('sets required from field context', async () => {
		const context = new Map();
		context.set('field', {
			id: 'test',
			name: 'test',
			describedBy: undefined,
			invalid: false,
			required: true,
		});

		const { container } = render(Input, {
			props: { name: 'test' },
			context,
		});
		const input = container.querySelector('input')!;
		expect(input.hasAttribute('required')).toBe(true);
	});

	it('prefers required prop over field context', async () => {
		const context = new Map();
		context.set('field', {
			id: 'test',
			name: 'test',
			describedBy: undefined,
			invalid: false,
			required: true,
		});

		const { container } = render(Input, {
			props: { name: 'test', required: false },
			context,
		});
		const input = container.querySelector('input')!;
		expect(input.hasAttribute('required')).toBe(false);
	});

	it('forwards rest props', async () => {
		const { container } = render(Input, {
			name: 'test',
			'data-test': 'value',
			maxlength: 10,
		});
		const input = container.querySelector('input')!;
		expect(input.getAttribute('data-test')).toBe('value');
		expect(input.getAttribute('maxlength')).toBe('10');
	});
});
