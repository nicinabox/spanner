<script lang="ts">
	import ButtonGroup from './ButtonGroup.svelte';
	import Button from './Button.svelte';
	import Menu from './Menu.svelte';
	import type { ButtonSize, ButtonVariant, ButtonColor } from './Button.svelte';
	import type { ClassValue } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Item } from './Menu.svelte';

	interface Props {
		children: Snippet;
		items: Item[];
		onAction?: () => void;
		onSelect?: (details: { value: string }) => void;
		variant?: ButtonVariant;
		color?: ButtonColor;
		size?: ButtonSize;
		disabled?: boolean | null;
		class?: ClassValue;
		id?: string;
		start?: Snippet;
		end?: Snippet;
	}

	let {
		children,
		items,
		onAction,
		onSelect,
		variant = 'solid',
		color = 'brand',
		size = 'md',
		disabled,
		class: className,
		id,
		start,
		end,
	}: Props = $props();
</script>

<ButtonGroup class={className}>
	<Button {variant} {color} {size} {disabled} onclick={onAction}>
		{@render children()}
	</Button>
	<Menu
		{items}
		{variant}
		{color}
		{size}
		{disabled}
		{onSelect}
		{id}
		{start}
		{end}
		icon
		positioning={{
			placement: 'bottom-end',
		}}
	/>
</ButtonGroup>
