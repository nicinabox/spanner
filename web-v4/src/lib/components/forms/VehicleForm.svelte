<script lang="ts">
	import SelectField from '$lib/components/SelectField.svelte';
	import SwitchField from '$lib/components/SwitchField.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { findPlainErrors } from '$lib/utils/form';
	import type { ActionData } from '../../../routes/vehicles/new/$types';
	import Dialog from '../Dialog.svelte';

	interface Props {
		form: ActionData;
		values?: Vehicle;
		action?: string;
	}

	let { form, values, action }: Props = $props();
	let errorsList = findPlainErrors(form?.errors);

	let confirmDelete: HTMLDialogElement;
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

{#if values}
	<div class="divider"></div>

	<button class="btn btn-outline btn-sm btn-error" onclick={() => confirmDelete.showModal()}>
		Delete {values.name}
	</button>

	<Dialog bind:ref={confirmDelete} title="Please confirm delete">
		You can undo this action afterwards.
		{#snippet actions()}
			<form method="dialog">
				<button class="btn btn-neutral">Cancel</button>
			</form>
			<form method="post" action="?/delete">
				<button class="btn btn-error">
					Delete {values.name}
				</button>
			</form>
		{/snippet}
	</Dialog>
{/if}
