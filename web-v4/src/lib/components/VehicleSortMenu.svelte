<script lang="ts">
	import type { Order, Sortable } from '$lib/data/vehicles';
	import {
		orderToHuman,
		vehicleSortOrderToHuman,
		vehicleSortStrategy,
		vehicleSortStrategyToHuman,
		type VehicleSortStrategy
	} from '$lib/utils/sortable';
	import { CheckIcon } from 'lucide-svelte';
	import DropdownMenu from './DropdownMenu.svelte';

	interface Props {
		onSelect?: (value: Sortable) => void;
		sortable?: Sortable;
	}

	let { sortable = ['created_at', 'desc'], onSelect }: Props = $props();

	const [sortStrategy, sortOrder] = sortable;
</script>

<DropdownMenu
	label={`Order By: ${orderToHuman(sortable)} ${vehicleSortStrategyToHuman[sortStrategy]}`}
	size="sm"
	variant="ghost"
	align="end"
>
	{#each Object.keys(vehicleSortStrategy) as value (value)}
		<li>
			<button
				role="menuitemradio"
				aria-checked={value === sortStrategy}
				onclick={() => onSelect?.([value as VehicleSortStrategy, sortOrder])}
			>
				<CheckIcon size={16} />
				{vehicleSortStrategyToHuman[value as VehicleSortStrategy]}
			</button>
		</li>
	{/each}
	<li role="separator"></li>
	{#each ['asc', 'desc'] as order, i (order)}
		<li>
			<button
				role="menuitemradio"
				aria-checked={order === sortOrder}
				onclick={() => onSelect?.([sortStrategy, order as Order])}
			>
				<CheckIcon size={16} />
				{vehicleSortOrderToHuman[sortStrategy][i]}
			</button>
		</li>
	{/each}
</DropdownMenu>
