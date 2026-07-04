<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Textarea from '$lib/components/common/Textarea.svelte';
	import NativeSelect from '$lib/components/common/NativeSelect.svelte';
	import { MileageLabel } from '$lib/utils/vehicle';
	import type { Classification } from '$lib/data/classifications';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';

	interface Props {
		vehicle: Vehicle;
		classifications: Classification[];
		schedule?: ServiceSchedule;
		action?: string;
	}

	let { vehicle, classifications, schedule, action = '?/schedule' }: Props = $props();

	let selectedClassificationId = $state<string>(schedule ? String(schedule.classificationId) : '');
	let distanceInterval = $state(schedule?.distanceInterval?.toString() ?? '');
	let monthInterval = $state(schedule?.monthInterval?.toString() ?? '');
	let notes = $state(schedule?.notes ?? '');

	let showNewClassification = $state(false);
	let newClassificationName = $state('');
	let newClassificationKeywords = $state('');

	const options = $derived(
		classifications.map((c) => ({ value: String(c.id), label: c.name })),
	);
</script>

<form method="POST" action={action} use:enhance>
	<div class="space-y-3">
		{#if showNewClassification}
			<Field label="New Classification Name" name="newName">
				<Input type="text" name="newName" bind:value={newClassificationName} placeholder="e.g. Hull Cleaning" />
			</Field>
			<Field label="Keywords (optional)" name="newKeywords">
				<Input type="text" name="newKeywords" bind:value={newClassificationKeywords} placeholder="hull cleaning, clean hull" />
			</Field>
			<Button size="sm" variant="ghost" onclick={() => (showNewClassification = false)}>
				Pick existing instead
			</Button>
		{:else}
			<Field label="Service" name="classificationId">
				<NativeSelect
					name="classificationId"
					options={[{ value: '', label: 'Select a service...' }, ...options]}
					bind:value={selectedClassificationId}
				/>
			</Field>
			<Button size="sm" variant="ghost" onclick={() => (showNewClassification = true)}>
				Create new service
			</Button>
		{/if}

		<Field label={MileageLabel(vehicle.distanceUnit)} name="distanceInterval">
			<Input type="number" name="distanceInterval" bind:value={distanceInterval} placeholder="Optional" />
		</Field>
		<Field label="Months" name="monthInterval">
			<Input type="number" name="monthInterval" bind:value={monthInterval} placeholder="Optional" />
		</Field>
		<Field label="Notes" name="notes">
			<Textarea name="notes" bind:value={notes} rows={2} placeholder="Optional" />
		</Field>
		<div class="flex gap-3">
			<Button type="submit">{schedule ? 'Update Service Task' : 'Create Service Task'}</Button>
		</div>
	</div>
</form>
