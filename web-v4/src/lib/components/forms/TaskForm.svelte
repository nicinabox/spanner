<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import InputAddon from '$lib/components/common/InputAddon.svelte';
	import { MileageLabel } from '$lib/utils/vehicle';
	import Textarea from '$lib/components/common/Textarea.svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';
	import Stepper from '../common/Stepper.svelte';

	interface Props {
		vehicle: Vehicle;
		schedule?: ServiceSchedule;
		action?: string;
		errors?: FormError[];
	}

	let { vehicle, schedule, action = '?/schedule', errors = [] }: Props = $props();

	// svelte-ignore state_referenced_locally
	let distanceInterval = $state(schedule?.distanceInterval?.toString() ?? '');
	// svelte-ignore state_referenced_locally
	let monthInterval = $state(schedule?.monthInterval?.toString() ?? '');

	// svelte-ignore state_referenced_locally
	let classificationName = $state(schedule?.classification?.name ?? '');
	// svelte-ignore state_referenced_locally
	let keywords = $state(schedule?.classification?.keywords?.join(', ') ?? '');

	let formErrors = $derived(errors.filter((e) => e.id === 'form'));
</script>

<form method="POST" {action} use:enhance autocomplete="off">
	<div class="space-y-3">
		<input type="hidden" name="classificationId" value={schedule?.classificationId ?? ''} />

		{#if formErrors.length > 0}
			<Alert role="alert">
				{#each formErrors as e}
					<p>{e.title}</p>
				{/each}
			</Alert>
		{/if}

		<fieldset>
			<Field label="Name" name="name" required {errors}>
				<Input
					type="text"
					name="name"
					bind:value={classificationName}
					placeholder="e.g. Oil Change"
					autocomplete="off"
				/>
			</Field>
			<Field
				label="Keywords"
				name="keywords"
				hint="Words that should match notes when updating History"
				{errors}
			>
				<Textarea
					name="keywords"
					bind:value={keywords}
					rows={1}
					placeholder="e.g., oil change, change oil"
					autocapitalize="off"
				/>
			</Field>
		</fieldset>

		<fieldset class="flex sm:gap-6 flex-col sm:flex-row *:flex-1">
			<Field label="Month Interval" name="monthInterval" {errors}>
				<InputGroup>
					<Input
						inputmode="numeric"
						name="monthInterval"
						bind:value={monthInterval}
						placeholder="Optional"
						min="0"
					/>
					<Stepper
						size="sm"
						variant="ghost"
						class="mr-1"
						onincrement={() => {
							let v = parseInt(monthInterval) || 0;
							monthInterval = String(v + 6);
						}}
						ondecrement={() => {
							let v = parseInt(monthInterval) || 0;
							if (v > 0) monthInterval = String(v - 6);
						}}
					/>
				</InputGroup>
			</Field>
			<Field
				label={MileageLabel(vehicle.distanceUnit) + ' Interval'}
				name="distanceInterval"
				{errors}
			>
				<InputGroup>
					<Input
						bind:value={distanceInterval}
						name="distanceInterval"
						inputmode="numeric"
						placeholder="Optional"
						min="0"
					/>
					<InputAddon>{vehicle.distanceUnit}</InputAddon>
				</InputGroup>
			</Field>
		</fieldset>

		<div class="flex gap-3">
			<Button type="submit">{schedule ? 'Update Task' : 'Create Task'}</Button>
		</div>
	</div>
</form>
