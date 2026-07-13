<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import InputAddon from '$lib/components/common/InputAddon.svelte';
	import Stepper from '$lib/components/common/Stepper.svelte';
	import { MileageLabel } from '$lib/utils/vehicle';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';

	interface Props {
		vehicle: Vehicle;
		schedule: ServiceSchedule;
		action?: string;
		errors?: FormError[];
		onsuccess?: () => void;
	}

	let { vehicle, schedule, action = '?/defer', errors = [], onsuccess }: Props = $props();

	let hasMonthInterval = $derived(schedule.monthInterval != null);
	let hasDistanceInterval = $derived(schedule.distanceInterval != null);
	let bothShown = $derived(hasMonthInterval && hasDistanceInterval);
	let isDeferred = $derived(schedule.deferred);

	// svelte-ignore state_referenced_locally
	let months = $state(schedule.deferDeltaMonths?.toString() ?? '');
	// svelte-ignore state_referenced_locally
	let distance = $state(schedule.deferDeltaMiles?.toString() ?? '');
</script>

<form
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
	<div class="space-y-3">
		<div class="flex sm:gap-6 flex-col sm:flex-row *:flex-1">
			{#if hasMonthInterval}
				<Field
					label="Defer Months"
					name="months"
					hint="Push due date by months"
					required={!bothShown}
				>
					<InputGroup>
						<Input
							inputmode="numeric"
							name="months"
							bind:value={months}
							placeholder={bothShown ? 'Optional' : ''}
							min="1"
							required={!bothShown}
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
			{/if}
			{#if hasDistanceInterval}
				<Field
					label={'Defer ' + MileageLabel(vehicle.distanceUnit)}
					name="distance"
					hint="Push mileage threshold by amount"
					required={!bothShown}
				>
					<InputGroup>
						<Input
							bind:value={distance}
							name="distance"
							inputmode="numeric"
							placeholder={bothShown ? 'Optional' : ''}
							min="1"
							required={!bothShown}
						/>
						<InputAddon>{vehicle.distanceUnit}</InputAddon>
					</InputGroup>
				</Field>
			{/if}
		</div>
		<div class="flex gap-2">
			<Button type="submit"
				>{isDeferred ? 'Update' : `Defer ${schedule.classificationName ?? 'Task'}`}</Button
			>
			{#if isDeferred}
				<Button type="submit" variant="outline" formaction="?/clear_defer">Clear</Button>
			{/if}
		</div>
	</div>
</form>
