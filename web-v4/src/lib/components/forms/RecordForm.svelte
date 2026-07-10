<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
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
	import { RefreshCw } from 'lucide-svelte';

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
			const results = await classifyNotes({ notes });
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
			if (key.startsWith('record[attachments]')) continue;
			fd.append(key, value);
		}
		for (const file of selectedFiles) {
			fd.append('record[attachments][]', file);
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
	{#if formErrors.length > 0}
		<div role="alert" class="p-3 rounded-md bg-negative/10 text-negative text-sm">
			{#each formErrors as e}
				<p>{e.title}</p>
			{/each}
		</div>
	{/if}

	<fieldset>
		<Field name="date" label="Date" errors={allErrors} required>
			<Input type="date" name="date" bind:value={date} required />
		</Field>
		<Field name="notes" label="Notes" errors={allErrors} required>
			<Textarea name="notes" bind:value={notes} required class="min-h-30" />
		</Field>

		{#if record?.id}
			<Field name="classifications" label="Tasks">
				<div class="flex flex-wrap gap-2 items-center">
					{#each selectedClassifications as c (c.id)}
						<Badge size="md" dismissible ondismiss={() => removeClassification(c)}>
							{c.name}
						</Badge>
					{/each}
					{#if availableClassifications.length > 0}
						<Menu
							trigger="Add"
							variant="outline"
							size="xs"
							items={availableClassifications.map((c) => ({
								value: String(c.id),
								label: c.name,
							}))}
							onSelect={({ value }) => {
								const c = allClassifications.find((cl) => cl.id === Number(value));
								if (c) addClassification(c);
							}}
						/>
					{/if}
					<Button
						type="button"
						variant="ghost"
						size="xs"
						onclick={handleClassify}
						disabled={classifying || !notes.trim()}
						title="Suggest from notes"
						icon
					>
						<RefreshCw size={14} class={classifying ? 'animate-spin' : ''} />
					</Button>
				</div>
			</Field>
		{/if}

		<Field name="mileage" label={MileageLabel(vehicle.distanceUnit)} errors={allErrors}>
			<InputGroup name="mileage" bind:value={mileage} inputmode="numeric">
				{#snippet endAddon()}{vehicle.distanceUnit}{/snippet}
			</InputGroup>
		</Field>

		{#if vehicle.preferences.enableCost}
			<Field name="cost" label="Cost" errors={allErrors}>
				<InputGroup name="cost" bind:value={cost} inputmode="numeric">
					{#snippet startAddon()}{getCurrencySymbol()}{/snippet}
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
			<input type="hidden" name="record[classification_ids][]" value={cid} />
		{:else}
			<input type="hidden" name="record[classification_ids][]" value="" />
		{/each}
	{/if}

	<input type="hidden" name="attachments_to_delete" value={markedForDeletion.join(',')} />

	<div class="flex gap-3">
		<Button type="submit" disabled={submitting}>
			{recordId ? 'Update' : 'Create'} Record
		</Button>
	</div>
</form>
