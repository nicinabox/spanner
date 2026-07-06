<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import { MileageLabel } from '$lib/utils/vehicle';
	import Textarea from '$lib/components/common/Textarea.svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';

	interface Props {
		vehicle: Vehicle;
		schedule?: ServiceSchedule;
		action?: string;
	}

	let {
		vehicle,
		schedule,
		action = '?/schedule',
	}: Props = $props();

	let distanceInterval = $state(schedule?.distanceInterval?.toString() ?? '');
	let monthInterval = $state(schedule?.monthInterval?.toString() ?? '');

	let newClassificationName = $state(schedule?.classification?.name ?? '');
	let keywords = $state(
		schedule?.classification?.keywords?.join(', ') ?? '',
	);
</script>

<form method="POST" {action} use:enhance autocomplete="off">
	<div class="space-y-3">
		<input type="hidden" name="classificationId" value={schedule?.classificationId ?? ''} />
		<Field label="Name" name="newName" required>
			<Input
				type="text"
				name="newName"
				bind:value={newClassificationName}
				placeholder="e.g. Hull Cleaning"
			/>
		</Field>
		<Field label="Keywords" name="keywords" hint="Words that trigger auto-classification.">
			<Textarea
				name="keywords"
				bind:value={keywords}
				placeholder="oil change, change oil"
			/>
		</Field>

		<Field label={MileageLabel(vehicle.distanceUnit)} name="distanceInterval">
			<InputGroup
				name="distanceInterval"
				type="number"
				bind:value={distanceInterval}
				placeholder="Optional"
			>
				{#snippet endAddon()}{vehicle.distanceUnit}{/snippet}
			</InputGroup>
		</Field>
		<Field label="Months" name="monthInterval">
			<Input type="number" name="monthInterval" bind:value={monthInterval} placeholder="Optional" />
		</Field>
		<div class="flex gap-3">
			<Button type="submit">{schedule ? 'Update Service Task' : 'Create Service Task'}</Button>
		</div>
	</div>
</form>
