<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import ErrorSummary from '$lib/components/ErrorSummary.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import NativeSelect from '$lib/components/common/NativeSelect.svelte';
	import Switch from '$lib/components/common/Switch.svelte';
	import VehicleColorIndicator from '$lib/components/vehicles/VehicleColorIndicator.svelte';
	import { getColorPalette } from '$lib/utils/colors';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';

	interface Props {
		errors?: FormError[];
		values?: Partial<Vehicle>;
		action?: string;
	}

	let { errors = [], values, action }: Props = $props();

	let formErrors = $derived(errors.filter((e) => e.id === 'form'));
</script>

<form method="post" {action} use:enhance class="flex flex-col gap-6">
	<ErrorSummary {formErrors} />

	<fieldset>
		<Field name="name" label="Name" {errors} required>
			<Input name="name" autocomplete="off" value={values?.name} required />
		</Field>

		<Field name="vin" label="VIN" {errors} hint="VIN is optional but recommended">
			<Input name="vin" value={values?.vin ?? ''} />
		</Field>

		<Field name="color" label="Color" {errors}>
			<label class="flex items-center gap-3 cursor-pointer">
				<VehicleColorIndicator color={values?.color} size={10} />
				<input
					type="color"
					name="color"
					value={values?.color ?? '#cccccc'}
					class="sr-only"
					onchange={(e) => {
						const input = e.currentTarget;
						const label = input.closest('label');
						if (label) {
							const indicator = label.querySelector('div');
							if (indicator) {
								const color = input.value;
								const palette = getColorPalette(color);
								indicator.style.background = `linear-gradient(0deg, ${palette[600]} 50%, ${color} 50%)`;
								indicator.style.borderColor = palette[400];
							}
						}
					}}
				/>
				Change color
			</label>
		</Field>

		<Field name="distanceUnit" label="Distance Unit" {errors} required>
			<NativeSelect
				name="distanceUnit"
				options={[
					{ value: 'mi', label: 'Miles' },
					{ value: 'km', label: 'Kilometers' },
					{ value: 'hr', label: 'Hours' },
					{ value: 'nmi', label: 'Nautical Miles' },
				]}
				value={values?.distanceUnit}
			/>
		</Field>
	</fieldset>

	<hr class="border-ink-200" />

	<fieldset class="flex flex-col gap-4">
		<legend class="font-semibold mb-4 text-lg">Preferences</legend>

		<Switch
			name="preferences.enableCost"
			defaultChecked={values?.preferences?.enableCost ?? true}
			class="flex-row-reverse w-full justify-between gap-6"
		>
			<div>
				<span class="font-medium">Enable cost</span>
				<p class="text-sm text-ink-500 font-normal">
					Show cost column in History and cost field in form.
				</p>
			</div>
		</Switch>

		<Switch
			name="preferences.sendReminderEmails"
			defaultChecked={values?.preferences?.sendReminderEmails ?? true}
			class="flex-row-reverse w-full justify-between gap-6"
		>
			<div>
				<span class="font-medium">Send reminder emails</span>
				<p class="text-sm text-ink-500 font-normal">
					Receive an email for upcoming reminders 2 weeks before and on the due date.
				</p>
			</div>
		</Switch>

		<Switch
			name="preferences.sendPromptForRecords"
			defaultChecked={values?.preferences?.sendPromptForRecords ?? true}
			class="flex-row-reverse w-full justify-between gap-6"
		>
			<div>
				<span class="font-medium">Send prompt for records email</span>
				<p class="text-sm text-ink-500 font-normal">
					Receive an email asking if you recently performed service based on your record history.
				</p>
			</div>
		</Switch>

		<Switch
			name="preferences.showMileageAdjustmentRecords"
			defaultChecked={values?.preferences?.showMileageAdjustmentRecords ?? true}
			class="flex-row-reverse w-full justify-between gap-6"
		>
			<div>
				<span class="font-medium">Show mileage adjustment records</span>
				<p class="text-sm text-ink-500 font-normal">Show mileage adjustment records in History.</p>
			</div>
		</Switch>
	</fieldset>

	{#if values?.id}
		<hr class="border-ink-200" />

		<fieldset class="flex flex-col gap-4">
			<Switch
				name="retired"
				defaultChecked={values?.retired}
				class="flex-row-reverse w-full justify-between gap-6"
			>
				<div>
					<span class="font-medium">Retire</span>
					<p class="text-sm text-ink-500 font-normal">
						Hide this vehicle from the list and stop sending reminders.
					</p>
				</div>
			</Switch>
		</fieldset>
	{/if}

	<div class="flex gap-3">
		<Button type="submit">Save {values?.name || 'vehicle'}</Button>
	</div>
</form>
