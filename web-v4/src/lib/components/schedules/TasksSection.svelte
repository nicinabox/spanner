<script lang="ts">
	import { Button, SplitButton } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import { sortSchedulesByDue } from '$lib/utils/schedules';
	import { intlFormatDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';
	import { Wrench, PlusIcon } from 'lucide-svelte';
	import { getPresets } from '$lib/data/serviceSchedules.remote';
	import type { PresetGroup } from '$lib/data/serviceSchedules.remote';
	import TaskCard from './TaskCard.svelte';
	import SuggestTasksDialog from '$lib/components/dialogs/SuggestTasksDialog.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Classification } from '$lib/data/classifications';
	import type { Vehicle } from '$lib/data/vehicles';

	interface Props {
		schedules: ServiceSchedule[];
		classifications: Classification[];
		vehicle: Vehicle;
	}

	let { schedules, classifications, vehicle }: Props = $props();

	let completingId = $state<number | null>(null);
	let suggestOpen = $state(false);
	let suggestType = $state<string | null>(null);
	let presetGroups = $state<Record<string, PresetGroup> | null>(null);

	$effect(() => {
		getPresets({ distanceUnit: vehicle.distanceUnit })
			.then((data) => {
				presetGroups = data;
			})
			.catch(() => {
				presetGroups = {};
			});
	});

	let splitItems = $derived(
		presetGroups
			? Object.entries(presetGroups).map(([key, group]) => ({
					value: key,
					label: group.name,
				}))
			: [],
	);

	const existingClassificationNames = $derived(
		new Set(
			schedules
				.map((s) => {
					const c = classifications.find((cl) => cl.id === s.classificationId);
					return c?.name.toLowerCase();
				})
				.filter(Boolean) as string[],
		),
	);

	const sorted = $derived(sortSchedulesByDue(schedules, vehicle.estimatedMileage));

	const classificationName = (classificationId: number): string => {
		return classifications.find((c) => c.id === classificationId)?.name ?? 'Unknown';
	};

	const intervalSummary = (schedule: ServiceSchedule): string => {
		const parts: string[] = [];
		if (schedule.monthInterval) {
			parts.push(`${schedule.monthInterval} mo`);
		}
		if (schedule.distanceInterval) {
			parts.push(formatMileage(schedule.distanceInterval, vehicle.distanceUnit));
		}
		return parts.join(' or ');
	};
</script>

<div class="mb-3">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold flex items-center gap-2">
			<Wrench size={18} />
			Recurring Tasks
		</h2>
		<div class="flex items-center gap-2">
			{#if !vehicle.retired}
				<SplitButton
					size="sm"
					items={splitItems}
					onAction={() => {
						window.location.href = `/vehicles/${vehicle.id}/add?view=schedule`;
					}}
					onSelect={(e) => {
						suggestType = e.value;
						suggestOpen = true;
					}}
				>
					<PlusIcon size={14} />
					New Task
				</SplitButton>
			{/if}
		</div>
	</div>
	<p class="text-base text-ink-400 mt-1">Tasks auto-advance on completion</p>
</div>

{#if schedules.length}
	<ul class="space-y-3">
		{#each sorted as schedule (schedule.id)}
			<li>
				<TaskCard
					{schedule}
					{vehicle}
					classificationName={classificationName(schedule.classificationId)}
					intervalSummary={intervalSummary(schedule)}
					completing={completingId === schedule.id}
					oncomplete={() => (completingId = schedule.id)}
					oncancel={() => (completingId = null)}
				/>
			</li>
		{/each}
	</ul>
{:else}
	<EmptyState
		size="md"
		heading="No tasks yet"
		variant="filled"
		details="Set tasks for recurring maintenance schedules"
		class="max-w-none bg-ink-50 text-ink-700"
	/>
{/if}

<SuggestTasksDialog
	open={suggestOpen}
	onOpenChange={(v) => {
		suggestOpen = v;
		if (!v) suggestType = null;
	}}
	initialType={suggestType}
	{existingClassificationNames}
	distanceUnit={vehicle.distanceUnit}
/>
