<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import Stat from '$lib/components/Stat.svelte';
	import { formatEstimatedMileage, formatMileage, formatMilesPerYear } from '$lib/utils/vehicle';
	import HistoryTable from '$lib/components/HistoryTable.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { resolve } from '$app/paths';
	import Markdown from '$lib/components/Markdown.svelte';
	import { intlFormatDateUTC, parseDateUTC } from '$lib/utils/date';
	import { intlFormat } from 'date-fns';
	import Button from '$lib/components/ui/Button.svelte';
	import { ChevronRight, NotebookPen, PlusIcon, WrenchIcon } from 'lucide-svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { isReminderOverdue } from '$lib/utils/reminders';

	let { data }: PageProps = $props();

	const view = $derived(page.url.searchParams.get('view') ?? 'history');

	let searchQuery = $state('');
	let history = $derived.by(() => {
		if (!searchQuery) return data.history;
		return data.history.filter((item) =>
			JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
		);
	});
</script>

<div>
	{#if view === 'history'}
		<section class="my-8" id="history">
			{#if data.history.length}
				<header class="my-8">
					<div class="flex justify-between gap-16 overflow-auto pointer-coarse:no-scrollbar">
						<Stat title="Estimated Mileage" value={formatEstimatedMileage(data.vehicle)} />
						<Stat title="Mileage Rate" value={formatMilesPerYear(data.vehicle)} />
						<Stat
							title="Since"
							value={intlFormat(parseDateUTC(data.history[0]?.date), {
								month: 'short',
								year: 'numeric',
								day: 'numeric'
							})}
						/>
						<Stat title="VIN" value={data.vehicle.vin} />
					</div>
				</header>

				<div class="flex justify-between gap-10">
					<Input
						type="search"
						name="search"
						placeholder="Search history"
						class="mb-4 w-full sm:w-1/2 lg:w-1/3"
						bind:value={searchQuery}
						onfocus={(e) => e.target?.select()}
					/>

					<Button class="ml-auto" href={`/vehicles/${page.params.id}/add`}>
						<PlusIcon size={16} />
						New...
					</Button>
				</div>

				<HistoryTable vehicle={data.vehicle} {history} />
			{:else}
				<EmptyState
					heading="Add your vehicle's history"
					details="Try adding your purchase as the first record."
				>
					{#snippet action()}
						<Button href={resolve(`/vehicles/${data.vehicle.id}/add?notes=Purchase`)}>
							Add Purchase
						</Button>
					{/snippet}
				</EmptyState>
			{/if}
		</section>
	{/if}

	{#if view === 'reminders'}
		<section class="mx-auto my-8 max-w-[80ch]" id="reminders">
			{#if data.vehicle.reminders.length}
				<header class="my-8 flex">
					<Button class="ml-auto" href={`/vehicles/${page.params.id}/add?view=new-reminder`}>
						<PlusIcon size={16} />
						New Reminder
					</Button>
				</header>
				<ul>
					{#each data.vehicle.reminders as reminder (reminder.id)}
						<li class="mb-4">
							<div class="rounded-lg border bg-muted/50 px-6 py-4 shadow-sm">
								<div class="flex items-center justify-between gap-4">
									<div>
										<h3 class="text-lg font-semibold">
											{#if isReminderOverdue(reminder)}
												<span class="badge mr-2 bg-amber-500 text-amber-950">
													<WrenchIcon size={14} />
													Overdue
												</span>
											{/if}
											{reminder.notes}
										</h3>

										<span class="text-secondary-foreground">
											{#if reminder.reminderDate || reminder.mileage}
												Scheduled for
												{#if reminder.reminderDate}
													<strong>{intlFormatDateUTC(reminder.reminderDate)}</strong>
												{/if}
												{#if reminder.reminderType === 'date_or_mileage' && reminder.reminderDate}
													or
												{/if}
												{#if reminder.reminderType === 'mileage'}
													at
												{/if}
												{#if reminder.mileage}
													<strong
														>{formatMileage(reminder.mileage, data.vehicle.distanceUnit)}</strong
													>
												{/if}
											{:else}
												<span class="text-muted-foreground">No reminder set</span>
											{/if}
										</span>
									</div>

									<aside class="flex gap-2">
										<Button variant="secondary">Edit</Button>
										<Button>Move to History <ChevronRight /></Button>
									</aside>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<EmptyState
					heading="Get reminders in your inbox"
					details="Use reminders to get notified on a date or mileage."
				/>
			{/if}
		</section>
	{/if}

	{#if view === 'notes'}
		<section class="mx-auto my-8 max-w-[80ch]" id="notes">
			{#if data.vehicle.notes}
				<header class="my-8 flex">
					<Button class="ml-auto" href={`/vehicles/${page.params.id}/edit?view=notes`}>
						<NotebookPen size={16} />
						Edit
					</Button>
				</header>
				<Markdown
					class="mx-auto prose dark:prose-invert prose-h1:text-3xl"
					src={data.vehicle.notes}
				/>
			{:else}
				<EmptyState
					heading="Notes are for hard-to-remember things"
					details="Add tire pressures, oil capacity, or how to reset the clock."
				/>
			{/if}
		</section>
	{/if}
</div>
