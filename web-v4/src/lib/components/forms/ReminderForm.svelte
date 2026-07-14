<script lang="ts">
	import { enhance } from '$app/forms';
	import { addMonths } from 'date-fns';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import InputAddon from '$lib/components/common/InputAddon.svelte';
	import NativeSelect from '$lib/components/common/NativeSelect.svelte';
	import { formatDateISO, intlFormatDate, parseDateUTC } from '$lib/utils/date';
	import { formatMileage, mileageLabel, MileageLabel } from '$lib/utils/vehicle';
	import { estimateReminderDate } from '$lib/data/reminders.remote';
	import type { Reminder, ReminderType } from '$lib/data/reminders';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';
	import { Alert, ErrorSummary } from '$lib';

	interface Props {
		vehicle: Vehicle;
		reminder?: Reminder;
		errors?: FormError[];
		action?: string;
		noEnhance?: boolean;
	}

	let { vehicle, reminder, errors = [], action, noEnhance = false }: Props = $props();

	let formErrors = $derived(errors.filter((e) => e.id === 'form'));

	// svelte-ignore state_referenced_locally
	let notes = $state(reminder?.notes ?? '');
	// svelte-ignore state_referenced_locally
	let reminderType = $state<ReminderType>(reminder?.reminderType ?? '');
	// svelte-ignore state_referenced_locally
	let date = $state(
		reminder?.date ? reminder.date.slice(0, 10) : formatDateISO(addMonths(new Date(), 6)),
	);
	// svelte-ignore state_referenced_locally
	let mileage = $state(reminder?.mileage?.toString() ?? '');

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
	<ErrorSummary {formErrors} />

	<fieldset>
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

		<div class="flex sm:gap-6 flex-col sm:flex-row *:flex-1">
			{#if ['date', 'date_or_mileage'].includes(reminderType)}
				<Field name="date" label="Date" {errors} required>
					<Input type="date" name="date" bind:value={date} required />
					<div class="flex gap-2 mt-1.5">
						<Button
							type="button"
							variant="outline"
							size="xs"
							onclick={() => (date = formatDateISO(addMonths(parseDateUTC(date), 6)))}
						>
							+6 months
						</Button>
						<Button
							type="button"
							variant="outline"
							size="xs"
							onclick={() => (date = formatDateISO(addMonths(parseDateUTC(date), 12)))}
						>
							+1 year
						</Button>
					</div>
				</Field>
			{/if}

			{#if ['mileage', 'date_or_mileage'].includes(reminderType)}
				<Field name="mileage" label={MileageLabel(vehicle.distanceUnit)} {errors} required>
					<InputGroup>
						<Input bind:value={mileage} name="mileage" inputmode="numeric" />
						<InputAddon>{vehicle.distanceUnit}</InputAddon>
					</InputGroup>
					{#if vehicle.estimatedMileage}
						<div class="flex gap-2 mt-1.5">
							<Button
								type="button"
								variant="outline"
								size="xs"
								onclick={() =>
									(mileage = String(
										(mileage ? Number(mileage) : vehicle.estimatedMileage!) + 5000,
									))}
							>
								+5k
							</Button>
							<Button
								type="button"
								variant="outline"
								size="xs"
								onclick={() =>
									(mileage = String(
										(mileage ? Number(mileage) : vehicle.estimatedMileage!) + 10000,
									))}
							>
								+10k
							</Button>
						</div>
						<p class="text-sm text-ink-400">
							Estimated
							{formatMileage(vehicle.estimatedMileage, vehicle.distanceUnit)}
						</p>
					{/if}
				</Field>
			{/if}
		</div>

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
