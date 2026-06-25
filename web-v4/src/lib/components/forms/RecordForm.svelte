<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Textarea from '$lib/components/common/Textarea.svelte';
	import { formatDateISO } from '$lib/utils/date';
	import { getCurrencySymbol } from '$lib/utils/number';
	import type { HistoryEntry } from '$lib/data/history';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';

	interface Props {
		vehicle: Vehicle;
		record?: HistoryEntry;
		errors?: FormError[];
		action?: string;
	}

	let { vehicle, record, errors = [], action }: Props = $props();

	let formErrors = $derived(errors.filter((e) => e.id === 'form'));

	let date = $state(record?.date ? formatDateISO(new Date(record.date)) : formatDateISO(new Date()));
	let mileage = $state(record?.mileage?.toString() ?? '');
	let notes = $state(record?.notes ?? '');
	let cost = $state(record?.cost ?? '');
</script>

<form
	method="POST"
	action={action ?? `/vehicles/${vehicle.id}/records${record?.id ? `/${record.id}` : ''}`}
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
		<div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-7">
			<div>
				<Field name="date" label="Date" {errors} required>
					<input
						type="date"
						name="date"
						bind:value={date}
						required
						class="block w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm"
					/>
				</Field>
			</div>
			<div class="space-y-4">
				<Field name="notes" label="Notes" {errors} required>
					<Textarea name="notes" bind:value={notes} required class="min-h-[100px] font-mono" />
				</Field>

				<Field
					name="mileage"
					label={vehicle.distanceUnit === 'mi' ? 'Mileage' : 'Distance'}
					{errors}
				>
					<div class="flex">
						<Input
							name="mileage"
							bind:value={mileage}
							inputmode="numeric"
							size="lg"
							class="flex-1 rounded-r-none"
						/>
						<span
							class="inline-flex items-center rounded-r-md border border-l-0 border-ink-200 bg-ink-50 px-3 text-sm text-ink-500"
							>{vehicle.distanceUnit}</span
						>
					</div>
				</Field>

				{#if vehicle.preferences.enableCost}
					<Field name="cost" label="Cost" {errors}>
						<div class="flex">
							<span
								class="inline-flex items-center rounded-l-md border border-r-0 border-ink-200 bg-ink-50 px-3 text-sm text-ink-500"
								>{getCurrencySymbol()}</span
							>
							<Input
								name="cost"
								bind:value={cost}
								inputmode="numeric"
								size="lg"
								class="flex-1 rounded-l-none"
							/>
						</div>
					</Field>
				{/if}
			</div>
		</div>
	</fieldset>

	<div class="flex gap-3">
		<Button type="submit" size="lg">
			{record ? 'Update' : 'Create'} Record
		</Button>
	</div>
</form>
