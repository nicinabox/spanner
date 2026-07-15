<script lang="ts">
	import * as combobox from '@zag-js/combobox';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';
	import InputGroup from './InputGroup.svelte';
	import Input from './Input.svelte';
	import { Check, ChevronDown } from 'lucide-svelte';
	import Badge from './Badge.svelte';
	import Button from './Button.svelte';
	import type { KeyboardEventHandler } from 'svelte/elements';
	import { InputAddon } from '$lib';

	interface Props {
		multiple?: boolean;
		placeholder?: string;
		name?: string;
		options: Option[];
		value?: string[];
	}

	interface Option {
		value: string;
		label: string;
	}

	const id = $props.id();

	let {
		multiple,
		name,
		placeholder,
		value = $bindable(),
		options: optionsProp = [],
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	let options = $state(optionsProp);
	// svelte-ignore state_referenced_locally
	let allOptions = $state(optionsProp);

	const collection = $derived(
		combobox.collection({
			items: options,
		}),
	);

	// svelte-ignore state_referenced_locally
	const service = useMachine(combobox.machine, {
		id,
		multiple,
		selectionBehavior: multiple ? 'clear' : undefined,
		openOnKeyPress: true,
		openOnClick: true,
		allowCustomValue: true,
		name,
		get collection() {
			return collection;
		},
		onOpenChange() {
			options = allOptions;
		},
		get value() {
			return value;
		},
		onValueChange({ value: v }) {
			value = v;
		},
		onInputValueChange({ inputValue }) {
			const filtered = allOptions.filter((item) =>
				item.label.toLowerCase().includes(inputValue.toLowerCase()),
			);
			options = filtered.length > 0 ? filtered : allOptions;
		},
	});

	const api = $derived(combobox.connect(service, normalizeProps));

	const onkeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === 'Enter') e.preventDefault();

		if (e.key === 'Enter' && !api.highlightedItem) {
			const newValue = api.inputValue.trim();
			if (newValue) {
				const newOption = { label: newValue, value: newValue };
				options = allOptions = [newOption, ...allOptions];
				api.setValue(api.value.concat(newOption.value));
			}
		}

		if (e.key === 'ArrowDown' && !api.open) {
			return api.setOpen(true);
		}

		if (e.key === 'Backspace' && e.currentTarget.value === '') {
			if (api.value.length) {
				return api.setValue(api.value.slice(0, -1));
			}
		}
	};

	const inputProps = $derived.by(() => {
		const { size, color, ...rest } = api.getInputProps();
		return rest as Record<string, unknown>;
	});

	const triggerProps = $derived.by(() => {
		const { color, ...rest } = api.getTriggerProps();
		return rest;
	});
</script>

<div {...api.getRootProps()}>
	<div {...api.getControlProps()}>
		<InputGroup>
			{#if api.selectedItems.length}
				<div class="flex gap-1 px-2">
					{#each api.selectedItems as item (item.value)}
						<Badge
							dismissible
							size="md"
							ondismiss={() => {
								api.setValue(api.value.filter((v) => v !== item.value));
							}}
						>
							{item.label}
						</Badge>
					{/each}
				</div>
			{/if}
			<Input
				{...inputProps}
				{placeholder}
				onkeydown={(e) => {
					api.getInputProps().onkeydown?.(e);
					onkeydown(e);
				}}
			/>
			<InputAddon>
				<Button {...triggerProps} icon size="sm" color="neutral" variant="ghost">
					<ChevronDown size={18} />
				</Button>
			</InputAddon>
		</InputGroup>
	</div>
</div>

<div use:portal {...api.getPositionerProps()} inert={!api.open}>
	<ul
		{...api.getContentProps()}
		hidden={undefined}
		class={[
			'z-50 list-none min-w-[max(var(--reference-width),15ch)] p-1.5 bg-surface-raised border border-ink-200 rounded-md shadow-md',
			'origin-(--transform-origin,top) transition-[opacity,scale,translate] duration-250 ease-out-expo',
			'data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=open]:translate-y-0 data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.97] data-[state=closed]:-translate-y-2',
			'starting:opacity-0 starting:scale-[0.97] starting:-translate-y-2',
			!options.length && 'hidden',
		]}
	>
		{#if options.length > 0}
			{#each options as item}
				<li
					{...api.getItemProps({ item })}
					class="group relative pl-8 flex items-center gap-2 px-3 h-10 rounded-sm cursor-pointer select-none outline-none transition-colors duration-100 ease-out-expo hover:bg-black/6 data-highlighted:bg-black/6 dark:hover:bg-white/8 dark:data-highlighted:bg-white/8 aria-selected:text-bold"
				>
					<span
						class="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center size-5 shrink-0 [&_svg]:opacity-0 group-data-[state=checked]:[&_svg]:opacity-100"
						{...api.getItemIndicatorProps({ item })}
					>
						<Check size={16} />
					</span>
					<span {...api.getItemTextProps({ item })}>{item.label}</span>
				</li>
			{/each}
		{/if}
	</ul>
</div>
