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
		onSelect?: (value: Sortable, event: Event) => void;
		sortable?: Sortable;
	}

	let { sortable = ['created_at', 'desc'], onSelect }: Props = $props();

	let sortStrategy = $derived(sortable[0]);
	let sortOrder = $derived(sortable[1]);
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
				type="button"
				aria-checked={value === sortStrategy}
				onclick={(event) => onSelect?.([value as VehicleSortStrategy, sortOrder], event)}
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
				type="button"
				aria-checked={order === sortOrder}
				onclick={(event) => onSelect?.([sortStrategy, order as Order], event)}
			>
				<CheckIcon size={16} />
				{vehicleSortOrderToHuman[sortStrategy][i]}
			</button>
		</li>
	{/each}
</DropdownMenu>
