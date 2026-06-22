<script lang="ts">
	import Menu, { type OptionItem } from '$lib/components/common/Menu.svelte';
	import type { Order, Sortable } from '$lib/data/vehicles';
	import {
		orderToHuman,
		vehicleSortOrderToHuman,
		vehicleSortStrategy,
		vehicleSortStrategyToHuman,
		type VehicleSortStrategy
	} from '$lib/utils/sortable';

	interface Props {
		sortable?: Sortable;
		onSelect?: (value: Sortable) => void;
	}

	let { sortable = ['created_at', 'desc'], onSelect }: Props = $props();

	let sortStrategy = $derived(sortable[0]);
	let sortOrder = $derived(sortable[1]);

	let optionItems = $derived<OptionItem[]>([
		...Object.keys(vehicleSortStrategy).map((value) => ({
			type: 'radio' as const,
			name: 'strategy',
			value,
			label: vehicleSortStrategyToHuman[value as VehicleSortStrategy],
			checked: value === sortStrategy,
			onCheckedChange: (checked: boolean) => {
				if (checked) onSelect?.([value as VehicleSortStrategy, sortOrder]);
			}
		})),
		{ type: 'separator' as const },
		...['asc', 'desc'].map((order, i) => ({
			type: 'radio' as const,
			name: 'order',
			value: order,
			label: vehicleSortOrderToHuman[sortStrategy][i],
			checked: order === sortOrder,
			onCheckedChange: (checked: boolean) => {
				if (checked) onSelect?.([sortStrategy, order as Order]);
			}
		}))
	]);
</script>

<Menu
	trigger="Order By: {orderToHuman(sortable)} {vehicleSortStrategyToHuman[sortStrategy]}"
	{optionItems}
/>
