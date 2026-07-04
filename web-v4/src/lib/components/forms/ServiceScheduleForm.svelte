<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/common/Button.svelte';
	import Field from '$lib/components/common/Field.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import InputGroup from '$lib/components/common/InputGroup.svelte';
	import NativeSelect from '$lib/components/common/NativeSelect.svelte';
	import SegmentedControl from '$lib/components/common/SegmentedControl.svelte';
	import { MileageLabel } from '$lib/utils/vehicle';
	import { getPresets, type Preset } from '$lib/data/serviceSchedules.remote';
	import type { Classification } from '$lib/data/classifications';
	import type { ServiceSchedule } from '$lib/data/serviceSchedules';
	import type { Vehicle } from '$lib/data/vehicles';

	interface Props {
		vehicle: Vehicle;
		classifications: Classification[];
		schedule?: ServiceSchedule;
		action?: string;
	}

	let { vehicle, classifications, schedule, action = '?/schedule' }: Props = $props();

	let selectedClassificationId = $state<string>(schedule ? String(schedule.classificationId) : '');
	let distanceInterval = $state(schedule?.distanceInterval?.toString() ?? '');
	let monthInterval = $state(schedule?.monthInterval?.toString() ?? '');

	let newClassificationName = $state('');
	let newClassificationKeywords = $state('');
	let keywords = $state('');
	let keywordsChanged = $state(false);

	let presets = $state<Record<string, Preset[]> | null>(null);
	let presetType = $state<string>('');
	let selectedPreset = $state<string>('');

	$effect(() => {
		getPresets({}).then((data) => {
			presets = data;
		});
	});

	const isCustom = $derived(presetType === '__custom__');

	const typeOptions = $derived([
		{ value: '', label: 'Select type...' },
		...Object.keys(presets ?? {}).map((t) => ({
			value: t,
			label: t.charAt(0).toUpperCase() + t.slice(1),
		})),
		{ value: '__custom__', label: 'Custom' },
	]);

	const presetOptions = $derived(
		(presets?.[presetType] ?? []).map((p) => ({ value: p.name, label: p.name, preset: p })),
	);

	$effect(() => {
		if (selectedPreset && presetType && !isCustom) {
			const preset = presets?.[presetType]?.find((p) => p.name === selectedPreset);
			if (preset) {
				const classification = classifications.find(
					(c) => c.name.toLowerCase() === preset.name.toLowerCase(),
				);
				if (classification) {
					selectedClassificationId = String(classification.id);
				}
				keywords = preset.keywords?.join(', ') ?? '';
				distanceInterval = preset.distanceInterval?.toString() ?? '';
				monthInterval = preset.monthInterval?.toString() ?? '';
			}
		}
	});

	const options = $derived(
		classifications.map((c) => ({ value: String(c.id), label: c.name })),
	);
</script>

<form method="POST" action={action} use:enhance>
	<div class="space-y-3">
		<Field label="Type" name="presetType">
			<NativeSelect
				name="presetType"
				options={typeOptions}
				bind:value={presetType}
			/>
		</Field>

		{#if isCustom}
			<Field label="Name" name="newName" required>
				<Input type="text" name="newName" bind:value={newClassificationName} placeholder="e.g. Hull Cleaning" />
			</Field>
			<Field label="Keywords (optional)" name="newKeywords" hint="Words that trigger auto-classification. Separate with commas.">
				<Input type="text" name="newKeywords" bind:value={newClassificationKeywords} placeholder="hull cleaning, clean hull" />
			</Field>
		{:else if presetType}
			<Field label="Service" name="classificationId">
				<NativeSelect
					name="classificationId"
					options={[{ value: '', label: 'Select a service...' }, ...presetOptions]}
					bind:value={selectedPreset}
				/>
			</Field>
			{#if selectedPreset}
				<Field label="Keywords" name="keywords" hint="Words that trigger auto-classification. Separate with commas.">
					<Input type="text" name="keywords" bind:value={keywords} placeholder="oil change, change oil" oninput={() => (keywordsChanged = true)} />
				</Field>
				<input type="hidden" name="keywordsChanged" value={String(keywordsChanged)} />
			{/if}
		{/if}

		<Field label={MileageLabel(vehicle.distanceUnit)} name="distanceInterval">
			<InputGroup name="distanceInterval" placeholder="Optional">
				{#snippet endAddon()}{vehicle.distanceUnit}{/snippet}
				<Input type="number" name="distanceInterval" bind:value={distanceInterval} />
			</InputGroup>
		</Field>
		<Field label="Months" name="monthInterval">
			<Input type="number" name="monthInterval" bind:value={monthInterval} placeholder="Optional" />
		</Field>
		<div class="flex gap-3">
			<Button type="submit">{schedule ? 'Update Service Task' : 'Create Service Task'}</Button>
		</div>
	</div>
</form>
