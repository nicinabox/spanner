<script lang="ts">
	import { enhance } from '$app/forms';
	import { addMonths } from 'date-fns';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import NativeSelect from '$lib/components/common/NativeSelect.svelte';
	import { formatDateISO, intlFormatDate, parseDateUTC } from '$lib/utils/date';
	import { formatMileage, mileageLabel, MileageLabel } from '$lib/utils/vehicle';
	import { estimateReminderDate } from '$lib/data/reminders.remote';
	import type { Reminder, ReminderType } from '$lib/data/reminders';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';
	import { Alert } from '$lib';
	import { loadDraft, saveDraft, clearDraft } from '$lib/utils/draft';

	interface Props {
		vehicle: Vehicle;
		reminder?: Reminder;
		errors?: FormError[];
		action?: string;
		noEnhance?: boolean;
	}

	let { vehicle, reminder, errors = [], action, noEnhance = false }: Props = $props();

	let formErrors = $derived(errors.filter((e) => e.id === 'form'));

	let draftKey = $derived(
		reminder?.id ? `reminder:${vehicle.id}:${reminder.id}` : `reminder:${vehicle.id}:new`,
	);

	// svelte-ignore state_referenced_locally
	let notes = $state(loadDraft(draftKey) ?? reminder?.notes ?? '');
	// svelte-ignore state_referenced_locally
	let reminderType = $state<ReminderType>(reminder?.reminderType ?? '');
	// svelte-ignore state_referenced_locally
	let date = $state(
		reminder?.date
			? formatDateISO(new Date(reminder.date))
			: formatDateISO(addMonths(new Date(), 6)),
	);
	// svelte-ignore state_referenced_locally
	let mileage = $state(reminder?.mileage?.toString() ?? '');

	$effect(() => {
		if (notes && notes !== (reminder?.notes ?? '')) {
			saveDraft(draftKey, notes);
		} else if (!notes) {
			clearDraft(draftKey);
		}
	});

	let estimatedDate = $state<Date | null>(null);

	let mileageNum = $derived(Number(mileage));

	$effect(() => {
		const estimate = async () => {
			if (mileageNum > 0) {
				try {
					const data = await estimateReminderDate({
						vehicleId: String(vehicle.id),
						mileage: mileageNum,
						date,
						reminderType,
					});
					if (data.reminderDate) {
						estimatedDate = parseDateUTC(data.reminderDate);
					}
				} catch {
					estimatedDate = null;
				}
			} else {
				estimatedDate = null;
			}
		};
		estimate();
	});
</script>

<form
	method="POST"
	action={action ?? `/vehicles/${vehicle.id}/reminders${reminder ? `/${reminder.id}` : ''}`}
	use:enhance
	class="flex flex-col gap-6"
>
	{#if formErrors.length > 0}
		<div role="alert" class="p-3 rounded-md bg-negative/10 text-negative text-sm">
			{#each formErrors as e}
				<p>{e.title}</p>
			{/each}
		</div>
	{/if}

	<fieldset class="flex flex-col gap-4">
		<Field name="notes" label="Note" {errors} required>
			<Input name="notes" bind:value={notes} required />
		</Field>

		<Field name="reminderType" label="Remind me" {errors}>
			<NativeSelect
				name="reminderType"
				bind:value={reminderType}
				options={[
					{ value: '', label: "Don't remind me" },
					{ value: 'date_or_mileage', label: 'On a date or mileage, whichever is first' },
					{ value: 'date', label: 'On a date' },
					{ value: 'mileage', label: 'At a mileage' },
				]}
			/>
		</Field>

		{#if ['date', 'date_or_mileage'].includes(reminderType)}
			<Field name="date" label="Date" {errors} required>
				<Input type="date" name="date" bind:value={date} required />
			</Field>
		{/if}

		{#if ['mileage', 'date_or_mileage'].includes(reminderType)}
			<Field name="mileage" label={MileageLabel(vehicle.distanceUnit)} {errors} required>
				<InputGroup name="mileage" bind:value={mileage} inputmode="numeric">
					{#snippet endAddon()}{vehicle.distanceUnit}{/snippet}
				</InputGroup>
				{#if vehicle.estimatedMileage}
					<p class="text-sm text-ink-400">
						Estimated {mileageLabel(vehicle.distanceUnit)}
						{formatMileage(vehicle.estimatedMileage, vehicle.distanceUnit)}
					</p>
				{/if}
			</Field>
		{/if}

		{#if estimatedDate && ['date_or_mileage', 'mileage'].includes(reminderType)}
			<Alert variant="info">
				Estimated for {intlFormatDate(estimatedDate)}
			</Alert>
		{/if}
	</fieldset>

	<div class="flex gap-3">
		<Button type="submit">
			{reminder ? 'Update' : 'Create'} Reminder
		</Button>
	</div>
</form>
