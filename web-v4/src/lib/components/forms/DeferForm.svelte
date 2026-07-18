<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import ErrorSummary from '$lib/components/ErrorSummary.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import InputAddon from '$lib/components/common/InputAddon.svelte';
	import Stepper from '$lib/components/common/Stepper.svelte';
	import { MileageLabel } from '$lib/utils/vehicle';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';
	import { Confirm } from '$lib';

	interface Props {
		vehicle: Vehicle;
		schedule: ServiceSchedule;
		action?: string;
		errors?: FormError[];
		onsuccess?: () => void;
	}

	let formId = $props.id();

	let { vehicle, schedule, action = '?/defer', errors = [], onsuccess }: Props = $props();

	let formErrors = $derived(errors.filter((e) => e.id === 'form'));

	let isDeferred = $derived(schedule.deferred);

	// svelte-ignore state_referenced_locally
	let months = $state(schedule.deferDeltaMonths?.toString() ?? '');
	// svelte-ignore state_referenced_locally
	let distance = $state(schedule.deferDeltaMiles?.toString() ?? '');
</script>

<form
	id={`defer-form-${formId}`}
	method="POST"
	{action}
	use:enhance={() => {
		return async ({ result }) => {
			await applyAction(result);
			onsuccess?.();
		};
	}}
	autocomplete="off"
>
	<input type="hidden" name="id" value={schedule.id} />
	<ErrorSummary {formErrors} />
	<div class="space-y-3">
		<div class="flex sm:gap-6 flex-col sm:flex-row *:flex-1">
			<Field label="Defer Months" name="months" hint="Push due date by months" {errors}>
				<InputGroup>
					<Input
						inputmode="numeric"
						name="months"
						bind:value={months}
						placeholder="Optional"
						min="1"
					/>
					<InputAddon>
						<Stepper
							size="sm"
							variant="ghost"
							onincrement={() => {
								let v = parseInt(months) || 0;
								months = String(v + 6);
							}}
							ondecrement={() => {
								let v = parseInt(months) || 0;
								if (v > 0) months = String(v - 6);
							}}
						/>
					</InputAddon>
				</InputGroup>
			</Field>
			<Field
				label={'Defer ' + MileageLabel(vehicle.distanceUnit)}
				name="distance"
				hint="Push mileage threshold by amount"
				{errors}
			>
				<InputGroup>
					<Input
						bind:value={distance}
						name="distance"
						inputmode="numeric"
						placeholder="Optional"
						min="1"
					/>
					<InputAddon>{vehicle.distanceUnit}</InputAddon>
				</InputGroup>
			</Field>
		</div>
		<div class="flex gap-2">
			<Button type="submit">
				{isDeferred ? 'Update' : `Defer ${schedule.classificationName ?? 'Task'}`}
			</Button>
			{#if isDeferred}
				<Confirm title="Confirm Clear Deferred">
					{#snippet trigger({ onOpenChange })}
						<Button onclick={() => onOpenChange(true)} variant="ghost" color="danger">
							Clear Deferred
						</Button>
					{/snippet}
					<p>
						This will immediately clear and reset your deferred intervals back to the standard
						schedule.
					</p>
					{#snippet actions({ onOpenChange })}
						<Button
							type="submit"
							variant="outline"
							color="danger"
							form={`defer-form-${formId}`}
							formaction="?/clearDefer"
							onclick={() => onOpenChange(false)}
						>
							Confirm Clear
						</Button>

						<Button onclick={() => onOpenChange(false)}>Cancel</Button>
					{/snippet}
				</Confirm>
			{/if}
		</div>
	</div>
</form>
