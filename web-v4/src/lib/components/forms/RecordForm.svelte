<script lang="ts">
	import type { HistoryEntry } from '$lib/data/history';
	import type { Vehicle } from '$lib/data/vehicles';
	import { formatDateISO } from '$lib/utils/date';
	import { findPlainErrors } from '$lib/utils/form';
	import { getCurrencySymbol } from '$lib/utils/number';
	import type { ActionData } from '../../../routes/vehicles/[id]/add/$types';
	import Button from '../ui/Button.svelte';
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
		<div role="alert" class="alert alert-soft alert-error mb-4">
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
			<div
				class="focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-background px-3 text-base shadow-xs ring-offset-background transition-[color,box-shadow] has-[[data-invalid]]:border-destructive has-[[data-invalid]]:ring-destructive/20 has-[[data-invalid]]:ring-[3px]">
				<input
					type="text"
					pattern="[0-9,]*"
					title="Numbers with optional comma"
					min={vehicle.estimatedMileage}
					name="mileage"
					value={values?.mileage}
					class="w-full flex-1 bg-transparent py-1 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
				/>
				<span class="ml-2 text-sm text-muted-foreground">{vehicle.distanceUnit}</span>
			</div>
		</FormField>

		<FormField errors={form?.errors} name="cost" label="Cost" value={values?.cost}>
			<div
				class="focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-background px-3 text-base shadow-xs ring-offset-background transition-[color,box-shadow] has-[[data-invalid]]:border-destructive has-[[data-invalid]]:ring-destructive/20 has-[[data-invalid]]:ring-[3px]">
				<span class="mr-2 text-sm text-muted-foreground">{getCurrencySymbol()}</span>
				<input
					type="text"
					pattern="[0-9,]*"
					title="Numbers with optional comma"
					name="cost"
					value={values?.cost}
					class="w-full flex-1 bg-transparent py-1 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
				/>
			</div>
		</FormField>
	</fieldset>

	<div class="form-actions">
		<Button type="submit">Save</Button>
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
					<Button variant="destructive" onclick={() => dialog.showModal()}>Delete</Button>
				{/snippet}

				{#snippet actions()}
					<form method="post" action="?/delete">
						<Button variant="destructive">Delete</Button>
					</form>
					<form method="dialog">
						<Button variant="neutral">Back to safety</Button>
					</form>
				{/snippet}
			</Confirm>
		</div>
	</DangerZone>
{/if}
