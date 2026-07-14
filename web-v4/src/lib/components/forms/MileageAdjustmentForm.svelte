<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import ErrorSummary from '$lib/components/ErrorSummary.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import { formatMileage, mileageLabel, MileageLabel } from '$lib/utils/vehicle';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';

	interface Props {
		vehicle: Vehicle;
		errors?: FormError[];
		action?: string;
	}

	let { vehicle, errors = [], action }: Props = $props();

	let formErrors = $derived(errors.filter((e) => e.id === 'form'));

	let mileage = $state('');
</script>

<form
	method="POST"
	action={action ?? `/vehicles/${vehicle.id}/records`}
	use:enhance
	class="flex flex-col gap-6"
>
	<ErrorSummary {formErrors} />

	<fieldset>
		<Field
			name="mileage"
			label={`Enter your current ${mileageLabel(vehicle.distanceUnit)}`}
			{errors}
			required
		>
			<Input name="mileage" bind:value={mileage} inputmode="numeric" />
			{#if vehicle.estimatedMileage}
				<p class="text-sm text-ink-400">
					Your estimated {mileageLabel(vehicle.distanceUnit)} is {formatMileage(
						vehicle.estimatedMileage,
						vehicle.distanceUnit,
					)}
				</p>
			{/if}
		</Field>
	</fieldset>

	<input type="hidden" name="notes" value="Mileage adjustment" />
	<input type="hidden" name="recordType" value="mileage adjustment" />

	<div class="flex gap-3">
		<Button type="submit">Update Mileage</Button>
	</div>
</form>
