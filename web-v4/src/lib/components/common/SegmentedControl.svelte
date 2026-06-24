<script lang="ts">
	import * as radio from '@zag-js/radio-group';
	import { useMachine, normalizeProps } from '@zag-js/svelte';

	interface Item {
		value: string;
		label: string;
	}

	interface Props {
		items: Item[];
		name?: string;
		value?: string;
		defaultValue?: string;
		onValueChange?: (details: { value: string | null }) => void;
		disabled?: boolean;
		required?: boolean;
		invalid?: boolean;
		readOnly?: boolean;
		orientation?: 'horizontal' | 'vertical';
		id?: string;
		class?: string;
	}

	let {
		items,
		name,
		value: controlledValue,
		defaultValue,
		onValueChange,
		disabled,
		required,
		invalid,
		readOnly,
		orientation = 'horizontal',
		id: idProp,
		class: className
	}: Props = $props();

	let id = $props.id();
	let resolvedId = $derived(idProp ?? id);

	const service = useMachine(radio.machine, {
		id: resolvedId,
		name,
		defaultValue: controlledValue ?? defaultValue ?? items[0]?.value,
		onValueChange,
		disabled,
		required,
		invalid,
		readOnly,
		orientation
	});

	const api = $derived(radio.connect(service, normalizeProps));

	$effect(() => {
		if (controlledValue !== undefined && controlledValue !== api.value) {
			api.setValue(controlledValue);
		}
	});
</script>

<div
	{...api.getRootProps()}
	class="relative inline-flex bg-ink-100 rounded-md p-1 gap-0.5 {orientation === 'vertical'
		? 'flex-col'
		: 'flex-row'} {className}"
>
	<div
		{...api.getIndicatorProps()}
		class="rounded-sm bg-white dark:bg-black shadow-sm transition-all duration-150 ease-out-expo"
	></div>

	{#each items as item}
		<label
			{...api.getItemProps({ value: item.value })}
			class="relative z-10 flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
		>
			<span {...api.getItemTextProps({ value: item.value })}>
				{item.label}
			</span>
			<input {...api.getItemHiddenInputProps({ value: item.value })} />
		</label>
	{/each}
</div>

<style>
	[data-part='indicator'] {
		top: var(--top);
		width: var(--width);
		height: var(--height);
	}
</style>
