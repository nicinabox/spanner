<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
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
	{#if formErrors.length > 0}
		<div role="alert" class="p-3 rounded-md bg-negative/10 text-negative text-sm">
			{#each formErrors as e}
				<p>{e.title}</p>
			{/each}
		</div>
	{/if}

	<fieldset class="flex flex-col gap-4">
		<Field name="name" label="Name" {errors} required>
			<Input name="name" value={values?.name} required size="lg" />
		</Field>

		<Field name="vin" label="VIN" {errors} hint="VIN is optional but recommended">
			<Input name="vin" value={values?.vin ?? ''} size="lg" />
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
					{ value: 'nmi', label: 'Nautical Miles' }
				]}
				value={values?.distanceUnit}
				size="lg"
			/>
		</Field>
	</fieldset>

	<hr class="border-ink-200" />

	<fieldset class="flex flex-col gap-4">
		<legend class="font-semibold">Preferences</legend>

		<label class="flex items-center justify-between gap-3 cursor-pointer">
			<div>
				<span class="font-medium">Enable cost</span>
				<p class="text-sm text-ink-500">Show cost column in History and cost field in form.</p>
			</div>
			<Switch
				name="preferences.enableCost"
				defaultChecked={values?.preferences?.enableCost ?? true}
			/>
		</label>

		<label class="flex items-center justify-between gap-3 cursor-pointer">
			<div>
				<span class="font-medium">Send reminder emails</span>
				<p class="text-sm text-ink-500">
					Receive an email for upcoming reminders 2 weeks before and on the due date.
				</p>
			</div>
			<Switch
				name="preferences.sendReminderEmails"
				defaultChecked={values?.preferences?.sendReminderEmails ?? true}
			/>
		</label>

		<label class="flex items-center justify-between gap-3 cursor-pointer">
			<div>
				<span class="font-medium">Send prompt for records email</span>
				<p class="text-sm text-ink-500">
					Receive an email asking if you recently performed service based on your record history.
				</p>
			</div>
			<Switch
				name="preferences.sendPromptForRecords"
				defaultChecked={values?.preferences?.sendPromptForRecords ?? true}
			/>
		</label>

		<label class="flex items-center justify-between gap-3 cursor-pointer">
			<div>
				<span class="font-medium">Show mileage adjustment records</span>
				<p class="text-sm text-ink-500">Show mileage adjustment records in History.</p>
			</div>
			<Switch
				name="preferences.showMileageAdjustmentRecords"
				defaultChecked={values?.preferences?.showMileageAdjustmentRecords ?? true}
			/>
		</label>
	</fieldset>

	{#if values?.id}
		<hr class="border-ink-200" />

		<fieldset class="flex flex-col gap-4">
			<label class="flex items-center justify-between gap-3 cursor-pointer">
				<div>
					<span class="font-medium">Retire</span>
					<p class="text-sm text-ink-500">
						Hide this vehicle from the list and stop sending reminders.
					</p>
				</div>
				<Switch name="retired" defaultChecked={values?.retired} />
			</label>
		</fieldset>
	{/if}

	<div class="flex gap-3">
		<Button type="submit" size="lg">Save {values?.name || 'vehicle'}</Button>
	</div>
</form>
