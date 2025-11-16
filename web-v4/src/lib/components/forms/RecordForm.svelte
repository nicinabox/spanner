<script lang="ts">
	import type { HistoryEntry } from '$lib/data/history';
	import type { Vehicle } from '$lib/data/vehicles';
	import { formatDateISO } from '$lib/utils/date';
	import { findPlainErrors } from '$lib/utils/form';
	import { getCurrencySymbol } from '$lib/utils/number';
	import type { ActionData } from '../../../routes/vehicles/[id]/add/$types';
	import Confirm from '../Confirm.svelte';
	import DangerZone from '../DangerZone.svelte';
	import Divider from '../Divider.svelte';
	import FormField from '../FormField.svelte';
	import TextareaField from '../TextareaField.svelte';
	import TextField from '../TextField.svelte';

	interface Props {
		form: ActionData;
		vehicle: Vehicle;
		values?: Partial<HistoryEntry>;
	}

	let { form, vehicle, values }: Props = $props();
	let errorsList = findPlainErrors(form?.errors);
</script>

<form method="post" action="?/addHistoryEntry">
	{#if errorsList}
		<div role="alert" class="mb-4 alert alert-soft alert-error">
			{#each errorsList as message, i (i)}
				<p>{message}</p>
			{/each}
		</div>
	{/if}

	<fieldset class="fieldset">
		<TextField
			errors={form?.errors}
			type="date"
			name="date"
			label="Date"
			value={formatDateISO(values?.date ?? new Date())}
			required
		/>
		<TextareaField
			errors={form?.errors}
			name="notes"
			label="Notes"
			value={values?.notes}
			required
		/>

		<FormField errors={form?.errors} name="mileage" label="Mileage" value={values?.mileage}>
			{#snippet children(field)}
				<label class="input w-full">
					<input
						type="text"
						pattern="[0-9,]*"
						title="Numbers with optional comma"
						min={vehicle.estimatedMileage}
						{...field}
					/>
					<span class="label">{vehicle.distanceUnit}</span>
				</label>
			{/snippet}
		</FormField>

		<FormField errors={form?.errors} name="cost" label="Cost" value={values?.cost}>
			{#snippet children(field)}
				<label class="input w-full">
					<span class="label">{getCurrencySymbol()}</span>
					<input type="text" pattern="[0-9,]*" title="Numbers with optional comma" {...field} />
				</label>
			{/snippet}
		</FormField>
	</fieldset>

	<div class="form-actions">
		<button type="submit" class="btn btn-primary">Save</button>
	</div>
</form>

{#if values?.id}
	<Divider type="section" />

	<DangerZone>
		<div class="flex items-center justify-between gap-8">
			<p>Permanently delete from history after confirmation.</p>

			<Confirm title="Please confirm delete">
				You can't undo this action afterwards.

				{#snippet button(dialog)}
					<button class="btn btn-soft btn-error" onclick={() => dialog.showModal()}>
						Delete
					</button>
				{/snippet}

				{#snippet actions()}
					<form method="post" action="?/delete">
						<button class="btn btn-soft btn-error"> Delete </button>
					</form>
					<form method="dialog">
						<button class="btn btn-neutral">Back to safety</button>
					</form>
				{/snippet}
			</Confirm>
		</div>
	</DangerZone>
{/if}
