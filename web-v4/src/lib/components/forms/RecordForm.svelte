<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from '$lib/components/common/Button.svelte';
	import ErrorSummary from '$lib/components/ErrorSummary.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import InputAddon from '$lib/components/common/InputAddon.svelte';
	import Textarea from '$lib/components/common/Textarea.svelte';
	import AttachmentEditor from '$lib/components/attachments/AttachmentEditor.svelte';
	import { formatDateISO } from '$lib/utils/date';
	import { getCurrencySymbol } from '$lib/utils/number';
	import { MileageLabel } from '$lib/utils/vehicle';
	import type { HistoryEntry } from '$lib/data/history';
	import type { Vehicle } from '$lib/data/vehicles';
	import type { FormError } from '$lib/utils/form';
	import type { Classification } from '$lib/data/classifications';
	import { classifyNotes } from '$lib/data/classify.remote';
	import Badge from '$lib/components/common/Badge.svelte';
	import Menu from '$lib/components/common/Menu.svelte';
	import { RotateCw } from 'lucide-svelte';
	import Tooltip from '../common/Tooltip.svelte';

	interface Props {
		vehicle: Vehicle;
		record?: HistoryEntry;
		errors?: FormError[];
		action?: string;
		id?: number;
		classifications?: Classification[];
		distanceUnit?: string;
	}

	let {
		vehicle,
		record,
		errors = [],
		action = '',
		id,
		classifications = [],
		distanceUnit,
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	let recordId = record?.id;

	// Merge page-provided errors (from SvelteKit form prop) with action errors
	// set by the custom fetch handler below.
	let actionErrors = $state<FormError[]>([]);
	let allErrors = $derived([...errors, ...actionErrors]);
	let formErrors = $derived(allErrors.filter((e) => e.id === 'form'));
	let attachmentErrors = $derived(allErrors.filter((e) => e.id === 'attachments'));

	// svelte-ignore state_referenced_locally
	let date = $state(record?.date ? record.date.slice(0, 10) : formatDateISO(new Date()));
	// svelte-ignore state_referenced_locally
	let mileage = $state(record?.mileage?.toString() ?? vehicle.estimatedMileage?.toString() ?? '');
	// svelte-ignore state_referenced_locally
	let notes = $state(record?.notes ?? '');
	// svelte-ignore state_referenced_locally
	let cost = $state(record?.cost ?? '');

	let markedForDeletion = $state<string[]>([]);
	let selectedFiles = $state<File[]>([]);
	let submitting = $state(false);

	let classifying = $state(false);

	async function handleClassify() {
		if (!notes.trim()) return;
		classifying = true;
		try {
			const results = await classifyNotes({ notes, vehicleId: vehicle.id });
			for (const r of results) {
				if (r.confidence >= 0.25) {
					const c = allClassifications.find((cl) => cl.id === r.classification.id);
					if (c && !selectedClassificationIds.includes(c.id)) {
						selectedClassificationIds = [...selectedClassificationIds, c.id];
					}
				}
			}
		} catch {
			// silently ignore
		} finally {
			classifying = false;
		}
	}

	// svelte-ignore state_referenced_locally
	let allClassifications = $state<Classification[]>(classifications);
	// svelte-ignore state_referenced_locally
	let selectedClassificationIds = $state<number[]>(record?.classifications?.map((c) => c.id) ?? []);

	let activeIdSet = $derived(new Set(vehicle.serviceSchedules.map((s) => s.classificationId)));

	let availableClassifications = $derived(
		allClassifications.filter(
			(c) =>
				!selectedClassificationIds.some((id) => id === c.id) &&
				(activeIdSet.size === 0 || activeIdSet.has(c.id)),
		),
	);

	let selectedClassifications = $derived(
		allClassifications.filter((c) => selectedClassificationIds.includes(c.id)),
	);

	function addClassification(c: Classification) {
		if (!selectedClassificationIds.includes(c.id)) {
			selectedClassificationIds = [...selectedClassificationIds, c.id];
		}
	}

	function removeClassification(c: Classification) {
		selectedClassificationIds = selectedClassificationIds.filter((id) => id !== c.id);
	}

	function handleMarkDelete(id: string) {
		if (!markedForDeletion.includes(id)) {
			markedForDeletion = [...markedForDeletion, id];
		}
	}

	function handleRestore(id: string) {
		markedForDeletion = markedForDeletion.filter((x) => x !== id);
	}

	let formAction = $derived(action);

	// Custom submit: rebuild FormData with the staged files because the
	// browser's FileList can't be edited (no per-file removal API).
	const submit: SubmitFunction = ({ formData, cancel }) => {
		submitting = true;
		actionErrors = [];
		const fd = new FormData();
		for (const [key, value] of formData.entries()) {
			if (key.startsWith('attachments[') || key === 'attachments') continue;
			fd.append(key, value);
		}
		for (const file of selectedFiles) {
			fd.append('attachments[]', file);
		}
		cancel();
		fetch(formAction, {
			method: 'POST',
			body: fd,
			headers: { Accept: 'application/json' },
		})
			.then(async (response) => {
				const result = await response.json();
				if (result.type === 'redirect') {
					await goto(result.location, { invalidateAll: true });
					return;
				}
				if (result.type === 'failure' && result.data?.errors) {
					actionErrors = result.data.errors;
					return;
				}
				// Unexpected response — navigate to vehicle page as fallback.
				await goto(`/vehicles/${vehicle.id}`, { invalidateAll: true });
			})
			.catch(() => {
				// Network error — leave the user on the form to retry.
			})
			.finally(() => {
				submitting = false;
			});
		return () => {};
	};
</script>

<form
	method="POST"
	action={formAction}
	enctype="multipart/form-data"
	use:enhance={submit}
	class="flex flex-col gap-6"
>
	<ErrorSummary {formErrors} />

	<fieldset>
		<Field name="date" label="Date" errors={allErrors} required>
			<Input type="date" name="date" bind:value={date} required />
		</Field>
		<Field name="notes" label="Notes" errors={allErrors} required>
			<InputGroup orientation="vertical">
				<Textarea name="notes" bind:value={notes} required rows={2} />

				{#if record?.id}
					<InputAddon class="flex flex-wrap gap-2 py-2 mt-2 items-center border-t border-ink-200">
						<Tooltip content="Suggest from notes">
							{#snippet children(props)}
								<Button
									{...props}
									type="button"
									variant="ghost"
									size="xs"
									onclick={handleClassify}
									disabled={classifying || !notes.trim()}
									icon
								>
									<RotateCw size={14} class={classifying ? 'animate-spin' : ''} />
								</Button>
							{/snippet}
						</Tooltip>

						{#each selectedClassifications as c (c.id)}
							<Badge size="md" dismissible ondismiss={() => removeClassification(c)}>
								{c.name}
							</Badge>
						{/each}

						{#if availableClassifications.length > 0}
							<Menu
								size="xs"
								items={availableClassifications.map((c) => ({
									value: String(c.id),
									label: c.name,
								}))}
								onSelect={({ value }) => {
									const c = allClassifications.find((cl) => cl.id === Number(value));
									if (c) addClassification(c);
								}}
							>
								Add task
							</Menu>
						{/if}
					</InputAddon>
				{/if}
			</InputGroup>
		</Field>

		<Field name="mileage" label={MileageLabel(vehicle.distanceUnit)} errors={allErrors}>
			<InputGroup>
				<Input bind:value={mileage} name="mileage" inputmode="numeric" autocomplete="off" />
				<InputAddon>{vehicle.distanceUnit}</InputAddon>
			</InputGroup>
		</Field>

		{#if vehicle.preferences.enableCost}
			<Field name="cost" label="Cost" errors={allErrors}>
				<InputGroup>
					<InputAddon>{getCurrencySymbol()}</InputAddon>
					<Input bind:value={cost} name="cost" inputmode="numeric" />
				</InputGroup>
			</Field>
		{/if}
		<Field name="attachments" label="Attachments" errors={attachmentErrors}>
			<AttachmentEditor
				existing={record?.attachments ?? []}
				{markedForDeletion}
				bind:selectedFiles
				onMarkDelete={handleMarkDelete}
				onRestore={handleRestore}
			/>
		</Field>
	</fieldset>

	{#if record?.id}
		<input type="hidden" name="id" value={record.id} />

		{#each selectedClassificationIds as cid}
			<input type="hidden" name="classificationIds[]" value={cid} />
		{:else}
			<input type="hidden" name="classificationIds[]" value="" />
		{/each}
	{/if}

	<input type="hidden" name="attachmentsToDelete" value={markedForDeletion.join(',')} />

	<div class="flex gap-3">
		<Button type="submit" disabled={submitting}>
			{recordId ? 'Update' : 'Create'} Record
		</Button>
	</div>
</form>
