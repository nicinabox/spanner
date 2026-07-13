<script lang="ts">
	import ButtonGroup from './ButtonGroup.svelte';
	import Button from './Button.svelte';
	import type { ButtonSize, ButtonVariant, ButtonColor } from './Button.svelte';
	import { Minus, Plus } from 'lucide-svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		size?: ButtonSize;
		variant?: ButtonVariant;
		color?: ButtonColor;
		disabled?: boolean | null;
		class?: ClassValue;
		onincrement?: () => void;
		ondecrement?: () => void;
	};

	let {
		size = 'md',
		variant = 'outline',
		color = 'neutral',
		disabled,
		class: className,
		onincrement,
		ondecrement,
	}: Props = $props();

	let iconSize = $derived(size === 'sm' ? 14 : size === 'lg' ? 18 : 16);
	let hideDivider = $derived(variant === 'ghost');
</script>

<ButtonGroup class={className} divider={!hideDivider}>
	<Button icon {size} {variant} {color} {disabled} onclick={ondecrement}>
		<Minus size={iconSize} />
	</Button>
	<Button icon {size} {variant} {color} {disabled} onclick={onincrement}>
		<Plus size={iconSize} />
	</Button>
</ButtonGroup>
