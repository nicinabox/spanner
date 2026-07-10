<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import { MileageLabel } from '$lib/utils/vehicle';
	import Textarea from '$lib/components/common/Textarea.svelte';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';

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
			<Field label="Name" name="name" required>
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
			>
				<Textarea
					name="keywords"
					bind:value={keywords}
					rows={1}
					placeholder="e.g., oil change, change oil"
				/>
			</Field>
		</fieldset>

		<fieldset class="flex sm:gap-6 flex-col sm:flex-row *:flex-1">
			<Field label="Month Interval" name="monthInterval">
				<Input
					inputmode="numeric"
					name="monthInterval"
					bind:value={monthInterval}
					placeholder="Optional"
					min="0"
				/>
			</Field>
			<Field label={MileageLabel(vehicle.distanceUnit) + ' Interval'} name="distanceInterval">
				<InputGroup
					name="distanceInterval"
					inputmode="numeric"
					bind:value={distanceInterval}
					placeholder="Optional"
					min="0"
				>
					{#snippet endAddon()}{vehicle.distanceUnit}{/snippet}
				</InputGroup>
			</Field>
		</fieldset>

		<div class="flex gap-3">
			<Button type="submit">{schedule ? 'Update Task' : 'Create Task'}</Button>
		</div>
	</div>
</form>