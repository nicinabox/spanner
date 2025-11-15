<script lang="ts">
	import type { HistoryEntry } from '$lib/data/history';
	import type { Vehicle } from '$lib/data/vehicles';
	import { formatDateISO } from '$lib/utils/date';
	import { findPlainErrors } from '$lib/utils/form';
	import { getCurrencySymbol } from '$lib/utils/number';
	import type { ActionData } from '../../../routes/vehicles/[id]/add/$types';
	import Dialog from '../Dialog.svelte';
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

	let confirmDelete: HTMLDialogElement;
</script>

<form method="post" action="?/addHistoryEntry">
	{#if errorsList}
		<div role="alert" class="mb-4 alert alert-soft alert-error">
			{#each errorsList as message, i (i)}
				<p>{message}</p>
			{/each}
		</div>
	{/if}

	<TextField
		errors={form?.errors}
		type="date"
		name="date"
		label="Date"
		value={formatDateISO(values?.date ?? new Date())}
		required
	/>
	<TextareaField errors={form?.errors} name="notes" label="Notes" value={values?.notes} required />

	<FormField errors={form?.errors} name="mileage" label="Mileage" value={values?.mileage}>
		{#snippet children(field)}
			<label class="input">
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
			<label class="input">
				<span class="label">{getCurrencySymbol()}</span>
				<input type="text" pattern="[0-9,]*" title="Numbers with optional comma" {...field} />
			</label>
		{/snippet}
	</FormField>

	<button type="submit" class="btn btn-primary">Save</button>
</form>

{#if values?.id}
	<div class="divider"></div>

	<button class="btn btn-outline btn-sm btn-error" onclick={() => confirmDelete.showModal()}>
		Delete
	</button>

	<Dialog bind:ref={confirmDelete} title="Please confirm delete">
		You can't undo this action afterwards.
		{#snippet actions()}
			<form method="dialog">
				<button class="btn btn-neutral">Cancel</button>
			</form>
			<form method="post" action="?/delete">
				<button class="btn btn-error"> Delete </button>
			</form>
		{/snippet}
	</Dialog>
{/if}
