<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import HistoryTable from '$lib/components/HistoryTable.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { HistoryEntry } from '$lib/data/history';
	import type { Vehicle } from '$lib/data/vehicles';
	import { intlFormatDateUTC, parseDateUTC } from '$lib/utils/date';
	import { isReminderOverdue } from '$lib/utils/reminders';
	import { formatEstimatedMileage, formatMileage, formatMilesPerYear } from '$lib/utils/vehicle';
	import { intlFormat } from 'date-fns';
	import { BookOpenText, PlusIcon, WrenchIcon } from 'lucide-svelte';

	interface Props {
		history: HistoryEntry[];
		vehicle: Vehicle;
	}

	let props: Props = $props();

	let searchQuery = $state('');
	let history = $derived.by(() => {
		if (!searchQuery) return props.history;
		return props.history.filter((item) =>
			JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	let overdueReminder = $derived.by(() => {
		if (!props.vehicle.reminders) return null;
		return props.vehicle.reminders.find(isReminderOverdue);
	});
</script>

{#if props.history.length}
	<header class="my-8">
		<div class="flex items-center justify-between gap-16 overflow-auto pointer-coarse:no-scrollbar">
			{#if overdueReminder}
				<a
					href={resolve(`/vehicles/${props.vehicle.id}?view=reminders`)}
					class="min-w-fit rounded-lg border border-amber-500/50 px-5 py-3 hover:border-amber-500"
				>
					<h2 class="text-lg font-semibold">
						<span class="badge mr-2 bg-amber-500 text-amber-950">
							<WrenchIcon size={14} />
							Overdue
						</span>

						{overdueReminder.notes}
					</h2>

					<span class="text-muted-foreground">
						Scheduled for
						{#if overdueReminder.reminderDate}
							<strong>{intlFormatDateUTC(overdueReminder.reminderDate)}</strong>
						{/if}
						{#if overdueReminder.reminderType === 'date_or_mileage' && overdueReminder.reminderDate}
							or
						{/if}
						{#if overdueReminder.reminderType === 'mileage'}
							at
						{/if}
						{#if overdueReminder.mileage}
							<strong>{formatMileage(overdueReminder.mileage, props.vehicle.distanceUnit)}</strong>
						{/if}
					</span>
				</a>
			{/if}

			<Stat title="Estimated Mileage" value={formatEstimatedMileage(props.vehicle)} />
			<Stat title="Mileage Rate" value={formatMilesPerYear(props.vehicle)} />
			<Stat
				title="Since"
				value={intlFormat(parseDateUTC(props.history[0]?.date), {
					month: 'short',
					year: 'numeric',
					day: 'numeric'
				})}
			/>
			<Stat title="VIN" value={props.vehicle.vin} />
		</div>
	</header>

	<div class="flex justify-between gap-10">
		<Input
			type="search"
			name="search"
			placeholder="Search history"
			class="mb-4 w-full sm:w-1/2 lg:w-1/3"
			bind:value={searchQuery}
			onfocus={(e) => (e.target as HTMLInputElement)?.select()}
		/>

		<Button class="ml-auto" href={`/vehicles/${page.params.id}/add`}>
			<PlusIcon size={16} />
			New...
		</Button>
	</div>

	<HistoryTable vehicle={props.vehicle} {history} />
{:else}
	<EmptyState
		heading="Add your vehicle's history"
		details="Try adding your purchase as the first record"
	>
		{#snippet media()}
			<BookOpenText size={48} class="text-accent-foreground" />
		{/snippet}

		{#snippet action()}
			<Button href={`/vehicles/${props.vehicle.id}/add?notes=Purchase`}>Add Purchase</Button>
		{/snippet}
	</EmptyState>
{/if}
