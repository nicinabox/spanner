<script lang="ts">
	import SelectField from '$lib/components/SelectField.svelte';
	import SwitchField from '$lib/components/SwitchField.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { findPlainErrors } from '$lib/utils/form';
	import type { ActionData } from '../../../routes/vehicles/new/$types';

	interface Props {
		form: ActionData;
		values?: Vehicle;
	}

	let { form, values }: Props = $props();
	let formErrors = findPlainErrors(form);
</script>

<form method="post">
	{#if formErrors}
		<div role="alert" class="mb-4 alert alert-soft alert-error">
			{#each formErrors as message, i (i)}
				<p>{message}</p>
			{/each}
		</div>
	{/if}

	<fieldset class="fieldset">
		<TextField {form} name="name" label="Name" value={values?.name} required />
		<TextField
			{form}
			name="vin"
			label="VIN"
			hint="VIN is optional but recommended"
			value={values?.vin}
		/>
		<SelectField
			{form}
			label="Distance Unit"
			name="distance_unit"
			options={[
				{ value: 'mi', label: 'Miles' },
				{ value: 'km', label: 'Kilometers' },
				{ value: 'hr', label: 'Hours' },
				{ value: 'nmi', label: 'Nautical Miles' }
			]}
			value={values?.distanceUnit}
		/>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Preferences</legend>
		<SwitchField
			{form}
			name="enable_cost"
			label="Enable Cost"
			value={values?.preferences.enableCost}
		/>
		<SwitchField {form} name="send_reminder_emails" label="Send Reminder Emails" />
	</fieldset>

	<button class="btn btn-primary" type="submit">Save</button>
</form>
