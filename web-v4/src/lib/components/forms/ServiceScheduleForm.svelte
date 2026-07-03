<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Textarea from '$lib/components/common/Textarea.svelte';
	import NativeSelect from '$lib/components/common/NativeSelect.svelte';
	import { MileageLabel } from '$lib/utils/vehicle';
	import type { Classification } from '$lib/data/classifications';
	import type { Vehicle } from '$lib/data/vehicles';

	interface Props {
		vehicle: Vehicle;
		classifications: Classification[];
	}

	let { vehicle, classifications }: Props = $props();

	let selectedClassificationId = $state<string>('');
	let distanceInterval = $state('');
	let monthInterval = $state('');
	let notes = $state('');

	let showNewClassification = $state(false);
	let newClassificationName = $state('');
	let newClassificationKeywords = $state('');

	const options = $derived(
		classifications.map((c) => ({ value: String(c.id), label: c.name })),
	);
</script>

<form method="POST" action="?/schedule" use:enhance>
	<div class="space-y-3">
		{#if showNewClassification}
			<Field label="New Classification Name" name="new_name">
				<Input type="text" name="new_name" bind:value={newClassificationName} placeholder="e.g. Hull Cleaning" />
			</Field>
			<Field label="Keywords (optional)" name="new_keywords">
				<Input type="text" name="new_keywords" bind:value={newClassificationKeywords} placeholder="hull cleaning, clean hull" />
			</Field>
			<Button size="sm" variant="ghost" onclick={() => (showNewClassification = false)}>
				Pick existing instead
			</Button>
		{:else}
			<Field label="Service" name="classification_id">
				<NativeSelect
					name="classification_id"
					options={[{ value: '', label: 'Select a service...' }, ...options]}
					bind:value={selectedClassificationId}
				/>
			</Field>
			<Button size="sm" variant="ghost" onclick={() => (showNewClassification = true)}>
				Create new service
			</Button>
		{/if}

		<Field label={MileageLabel(vehicle.distanceUnit)} name="distance_interval">
			<Input type="number" name="distance_interval" bind:value={distanceInterval} placeholder="Optional" />
		</Field>
		<Field label="Months" name="month_interval">
			<Input type="number" name="month_interval" bind:value={monthInterval} placeholder="Optional" />
		</Field>
		<Field label="Notes" name="notes">
			<Textarea name="notes" bind:value={notes} rows={2} placeholder="Optional" />
		</Field>
		<div class="flex gap-3">
			<Button type="submit">Create Schedule</Button>
		</div>
	</div>
</form>
