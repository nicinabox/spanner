<script lang="ts">
	import { enhance } from '$app/forms';
	import { addMonths } from 'date-fns';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import NativeSelect from '$lib/components/common/NativeSelect.svelte';
	import { formatDateISO, intlFormatDate, parseDateUTC } from '$lib/utils/date';
	import { formatMileage } from '$lib/utils/vehicle';
	import type { Reminder, ReminderType } from '$lib/data/reminders';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';

	interface Props {
		vehicle: Vehicle;
		reminder?: Reminder;
		errors?: FormError[];
		action?: string;
		noEnhance?: boolean;
	}

	let { vehicle, reminder, errors = [], action, noEnhance = false }: Props = $props();

	let formErrors = $derived(errors.filter((e) => e.id === 'form'));

	let notes = $state(reminder?.notes ?? '');
	let reminderType = $state<ReminderType>(reminder?.reminderType ?? '');
	let date = $state(
		reminder?.date
			? formatDateISO(new Date(reminder.date))
			: formatDateISO(addMonths(new Date(), 6)),
	);
	let mileage = $state(reminder?.mileage?.toString() ?? '');

	let estimatedDate = $state<Date | null>(null);

	let mileageNum = $derived(Number(mileage));

	$effect(() => {
		const estimate = async () => {
			if (mileageNum > 0) {
				try {
					const params = new URLSearchParams({
						'reminder[mileage]': mileageNum.toString(),
						'reminder[date]': date,
						'reminder[reminder_type]': reminderType,
					});
					const resp = await fetch(`/api/vehicles/${vehicle.id}/reminders/estimate_date?${params}`);
					if (resp.ok) {
						const data = await resp.json();
						if (data.reminder_date) {
							estimatedDate = parseDateUTC(data.reminder_date);
						}
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
			<Field
				name="mileage"
				label={vehicle.distanceUnit === 'mi' ? 'Mileage' : 'Distance'}
				{errors}
				required
			>
				<Input name="mileage" bind:value={mileage} inputmode="numeric" />
				{#if vehicle.estimatedMileage}
					<p class="text-sm text-ink-400">
						Estimated mileage {formatMileage(vehicle.estimatedMileage, vehicle.distanceUnit)}
					</p>
				{/if}
			</Field>
		{/if}

		{#if estimatedDate && ['date_or_mileage', 'mileage'].includes(reminderType)}
			<div class="rounded-md text-info border border-info bg-info/10 px-4 py-3 text-sm">
				Estimated for {intlFormatDate(estimatedDate)}
			</div>
		{/if}
	</fieldset>

	<div class="flex gap-3">
		<Button type="submit">
			{reminder ? 'Update' : 'Create'} Reminder
		</Button>
	</div>
</form>
