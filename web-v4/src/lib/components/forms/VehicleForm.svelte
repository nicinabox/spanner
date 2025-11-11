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
	let errorsList = findPlainErrors(form?.errors);
</script>

<form method="post">
	{#if errorsList}
		<div role="alert" class="mb-4 alert alert-soft alert-error">
			{#each errorsList as message, i (i)}
				<p>{message}</p>
			{/each}
		</div>
	{/if}

	<fieldset class="fieldset">
		<TextField errors={form?.errors} name="name" label="Name" value={values?.name} required />
		<TextField
			errors={form?.errors}
			name="vin"
			label="VIN"
			hint="VIN is optional but recommended"
			value={values?.vin}
		/>
		<SelectField
			errors={form?.errors}
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
			errors={form?.errors}
			name="enable_cost"
			label="Enable Cost"
			value={values?.preferences.enableCost}
		/>
		<SwitchField errors={form?.errors} name="send_reminder_emails" label="Send Reminder Emails" />
	</fieldset>

	<button class="btn btn-primary" type="submit">Save</button>
</form>
