<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import { MileageLabel } from '$lib/utils/vehicle';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';

	interface Props {
		vehicle: Vehicle;
		schedule: ServiceSchedule;
		action?: string;
		errors?: FormError[];
	}

	let { vehicle, schedule, action = '?/defer', errors = [] }: Props = $props();

	// svelte-ignore state_referenced_locally
	let months = $state(schedule.deferDeltaMonths?.toString() ?? '');
	// svelte-ignore state_referenced_locally
	let miles = $state(schedule.deferDeltaMiles?.toString() ?? '');

	let hasMonthInterval = $derived(schedule.monthInterval != null);
	let hasDistanceInterval = $derived(schedule.distanceInterval != null);
	let isDeferred = $derived(schedule.deferred);
</script>

<form method="POST" {action} use:enhance autocomplete="off">
	<input type="hidden" name="id" value={schedule.id} />
	<div class="space-y-3">
		<div class="flex sm:gap-6 flex-col sm:flex-row *:flex-1">
			{#if hasMonthInterval}
				<Field label="Months" name="months" hint="Push due date by months">
					<Input
						inputmode="numeric"
						name="months"
						bind:value={months}
						placeholder="Optional"
						min="1"
					/>
				</Field>
			{/if}
			{#if hasDistanceInterval}
				<Field label={MileageLabel(vehicle.distanceUnit)} name="miles" hint="Push mileage threshold by amount">
					<InputGroup
						name="miles"
						inputmode="numeric"
						bind:value={miles}
						placeholder="Optional"
						min="1"
					>
						{#snippet endAddon()}{vehicle.distanceUnit}{/snippet}
					</InputGroup>
				</Field>
			{/if}
		</div>
		<div class="flex gap-2">
			<Button type="submit">{isDeferred ? 'Update Defer' : 'Set Defer'}</Button>
			{#if isDeferred}
				<Button variant="outline" formaction="?/clear_defer">Clear Defer</Button>
			{/if}
		</div>
	</div>
</form>
