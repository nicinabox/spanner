<script lang="ts">
	import SelectField from '$lib/components/SelectField.svelte';
	import SwitchField from '$lib/components/SwitchField.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { findPlainErrors } from '$lib/utils/form';
	import type { ActionData } from '../../../routes/vehicles/new/$types';
	import Confirm from '../Confirm.svelte';
	import DangerZone from '../DangerZone.svelte';
	import Divider from '../Divider.svelte';

	interface Props {
		form: ActionData;
		values?: Partial<Vehicle>;
		action?: string;
	}

	let { form, values, action }: Props = $props();
	let errorsList = findPlainErrors(form?.errors);
</script>

<form method="post" {action}>
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
			name="distanceUnit"
			options={[
				{ value: 'mi', label: 'Miles' },
				{ value: 'km', label: 'Kilometers' },
				{ value: 'hr', label: 'Hours' },
				{ value: 'nmi', label: 'Nautical Miles' }
			]}
			value={values?.distanceUnit}
		/>
	</fieldset>

	<Divider type="section" />

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Preferences</legend>
		<SwitchField
			errors={form?.errors}
			name="preferences.enableCost"
			label="Enable cost"
			value={values?.preferences?.enableCost}
			hint="Show cost column in History and cost field in form."
		/>
		<Divider />
		<SwitchField
			errors={form?.errors}
			name="preferences.sendReminderEmails"
			label="Send reminder emails"
			value={values?.preferences?.sendReminderEmails}
			hint="Receive an email for upcoming reminders 2 weeks before and on the due date."
		/>
		<Divider />
		<SwitchField
			errors={form?.errors}
			name="preferences.sendPromptForRecords"
			label="Send prompt for records email"
			value={values?.preferences?.sendPromptForRecords}
			hint="Receive an email asking if you recenty performed service based on your record history."
		/>
		<Divider />
		<SwitchField
			errors={form?.errors}
			name="preferences.showMileageAdjustmentRecords"
			label="Show mileage adjustment records"
			value={values?.preferences?.showMileageAdjustmentRecords}
			hint="Show mileage adjustment records in History."
		/>
	</fieldset>

	{#if values?.id}
		<Divider type="section" />

		<fieldset class="fieldset">
			<SwitchField
				errors={form?.errors}
				name="retired"
				label="Retire"
				value={values?.retired}
				hint="Hide this vehicle from the list and stop sending reminders"
			/>
		</fieldset>
	{/if}

	<div class="form-actions">
		<button class="btn btn-primary" type="submit">Save {values?.name}</button>
	</div>
</form>

{#if values?.id}
	<Divider type="section" />
	<DangerZone>
		<div class="flex items-center justify-between gap-8">
			<p>
				Permanently delete this vehicle after confirmation.
				<br />
				Try <strong>Retire</strong> to hide and keep history instead.
			</p>

			<Confirm title="Please confirm delete">
				{values.name} will be permanently deleted. You can't undo this action afterwards.

				{#snippet button(dialog)}
					<button class="btn btn-soft btn-error" onclick={() => dialog.showModal()}>
						Delete
					</button>
				{/snippet}

				{#snippet actions()}
					<form method="post" action="?/delete">
						<button class="btn btn-soft btn-error">
							Delete {values.name}
						</button>
					</form>
					<form method="dialog">
						<button class="btn btn-neutral">Back to safety</button>
					</form>
				{/snippet}
			</Confirm>
		</div>
	</DangerZone>
{/if}
