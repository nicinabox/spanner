<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import type { Vehicle, VehiclePreferences } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';

	type DistanceUnit = 'mi' | 'km' | 'hr' | 'nmi';

	interface Props {
		errors?: FormError[];
		values?: Partial<Vehicle>;
		action?: string;
	}

	let { errors = [], values, action }: Props = $props();
</script>

<form method="post" {action} use:enhance class="flex flex-col gap-6">
	<fieldset class="flex flex-col gap-4">
		<Field name="name" label="Name" {errors} required>
			<Input name="name" value={values?.name} required />
		</Field>

		<Field name="vin" label="VIN" {errors} hint="VIN is optional but recommended">
			<Input name="vin" value={values?.vin ?? ''} />
		</Field>

		<Field name="color" label="Color" {errors}>
			<input
				type="color"
				name="color"
				value={values?.color ?? '#cccccc'}
				class="w-full h-8 rounded-md border border-ink-200 bg-canvas cursor-pointer"
			/>
		</Field>

		<Field name="distanceUnit" label="Distance Unit" {errors} required>
			<select
				name="distanceUnit"
				class="w-full px-3 py-2 h-8 text-sm rounded-md border border-ink-200 bg-canvas text-ink-900"
			>
				<option value="mi" selected={values?.distanceUnit === 'mi'}>Miles</option>
				<option value="km" selected={values?.distanceUnit === 'km'}>Kilometers</option>
				<option value="hr" selected={values?.distanceUnit === 'hr'}>Hours</option>
				<option value="nmi" selected={values?.distanceUnit === 'nmi'}>Nautical Miles</option>
			</select>
		</Field>
	</fieldset>

	<hr class="border-ink-200" />

	<fieldset class="flex flex-col gap-4">
		<legend class="font-semibold">Preferences</legend>

		<label class="flex items-center gap-3 cursor-pointer">
			<input type="checkbox" name="preferences.enableCost" checked={values?.preferences?.enableCost ?? true} class="accent-brand" />
			<div>
				<span class="font-medium">Enable cost</span>
				<p class="text-sm text-ink-500">Show cost column in History and cost field in form.</p>
			</div>
		</label>

		<label class="flex items-center gap-3 cursor-pointer">
			<input type="checkbox" name="preferences.sendReminderEmails" checked={values?.preferences?.sendReminderEmails ?? true} class="accent-brand" />
			<div>
				<span class="font-medium">Send reminder emails</span>
				<p class="text-sm text-ink-500">Receive an email for upcoming reminders 2 weeks before and on the due date.</p>
			</div>
		</label>

		<label class="flex items-center gap-3 cursor-pointer">
			<input type="checkbox" name="preferences.sendPromptForRecords" checked={values?.preferences?.sendPromptForRecords ?? true} class="accent-brand" />
			<div>
				<span class="font-medium">Send prompt for records email</span>
				<p class="text-sm text-ink-500">Receive an email asking if you recently performed service based on your record history.</p>
			</div>
		</label>

		<label class="flex items-center gap-3 cursor-pointer">
			<input type="checkbox" name="preferences.showMileageAdjustmentRecords" checked={values?.preferences?.showMileageAdjustmentRecords ?? true} class="accent-brand" />
			<div>
				<span class="font-medium">Show mileage adjustment records</span>
				<p class="text-sm text-ink-500">Show mileage adjustment records in History.</p>
			</div>
		</label>
	</fieldset>

	{#if values?.id}
		<hr class="border-ink-200" />

		<fieldset class="flex flex-col gap-4">
			<label class="flex items-center gap-3 cursor-pointer">
				<input type="checkbox" name="retired" checked={values?.retired} class="accent-brand" />
				<div>
					<span class="font-medium">Retire</span>
					<p class="text-sm text-ink-500">Hide this vehicle from the list and stop sending reminders.</p>
				</div>
			</label>
		</fieldset>
	{/if}

	<div class="flex gap-3">
		<Button type="submit">Save {values?.name || 'vehicle'}</Button>
	</div>
</form>
