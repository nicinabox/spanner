<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Textarea from '$lib/components/common/Textarea.svelte';
	import { formatDateISO } from '$lib/utils/date';
	import { MileageLabel } from '$lib/utils/vehicle';
	import type { Vehicle } from '$lib/data/vehicles';

	interface Props {
		vehicle: Vehicle;
		scheduleId: number;
		classificationName: string;
	}

	let { vehicle, scheduleId, classificationName }: Props = $props();

	let date = $state(formatDateISO(new Date()));
	let mileage = $state(vehicle.estimatedMileage?.toString() ?? '');
	let notes = $state(classificationName);
</script>

<form method="POST" action="?/complete" use:enhance>
	<input type="hidden" name="id" value={scheduleId} />
	<div class="space-y-3">
		<Field label="Date" name="date">
			<Input type="date" name="date" bind:value={date} />
		</Field>
		<Field label={MileageLabel(vehicle.distanceUnit)} name="mileage">
			<Input type="number" name="mileage" bind:value={mileage} />
		</Field>
		<Field label="Notes" name="notes">
			<Textarea name="notes" bind:value={notes} />
		</Field>
		<div class="flex">
			<Button type="submit">Complete</Button>
		</div>
	</div>
</form>
