<script lang="ts">
	import { Button, ErrorSummary } from '$lib';
	import Dialog from '$lib/components/common/Dialog.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Check, Plus, RefreshCw } from 'lucide-svelte';
	import { getIntervalSummary } from '$lib/utils/tasks';
	import type { DistanceUnit } from '$lib/data/vehicles';
	import type { PresetItem, PresetGroup } from '$lib/data/serviceSchedules';
	import type { FormError } from '$lib/utils/form';
	import { pluralize } from '$lib/utils/text';
	import { cn } from 'tailwind-variants';

	interface Props {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		presetGroup: PresetGroup | null;
		existingClassificationNames?: Set<string>;
		distanceUnit?: DistanceUnit;
	}

	let {
		open,
		onOpenChange,
		presetGroup,
		existingClassificationNames = new Set(),
		distanceUnit,
	}: Props = $props();

	let checked = $state<Set<number>>(new Set());
	let errors = $state<FormError[]>([]);

	// Reset checked state when modal closes
	$effect(() => {
		if (!open) {
			checked = new Set();
		}
	});

	const items = $derived(
		presetGroup?.items.filter((p) => !existingClassificationNames.has(p.name.toLowerCase())) ?? [],
	);

	const togglePreset = (index: number) => {
		const next = new Set(checked);
		if (next.has(index)) {
			next.delete(index);
		} else {
			next.add(index);
		}
		checked = next;
	};

	const selectedPresets: PresetItem[] = $derived(
		[...checked].map((i) => items[i]).filter(Boolean) as PresetItem[],
	);

	const submit: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				errors = [];
				onOpenChange(false);
				await update({ invalidateAll: true });
			} else if (result.type === 'failure' && result.data?.errors) {
				errors = result.data.errors;
			}
		};
	};

	const title = $derived(`Suggested tasks for ${presetGroup?.name}s`);
	const formId = 'suggest-form';
</script>

<Dialog {open} {onOpenChange} {title}>
	<form id={formId} method="POST" action="?/suggest" use:enhance={submit}>
		<input type="hidden" name="distanceUnit" value={distanceUnit} />
		<input type="hidden" name="presetData" value={JSON.stringify(selectedPresets)} />
		<ErrorSummary formErrors={errors} />
		<p class="mb-4">Add then edit to fit your needs.</p>
		<ul class="space-y-2">
			{#each items as preset, i}
				{@const isChecked = checked.has(i)}
				<li>
					<button
						type="button"
						class={cn(
							'w-full flex items-center gap-4 px-4 py-3 rounded-lg border text-left transition-all duration-150 ease-out-expo cursor-pointer border-ink-200 hover:border-ink-400',
							'data-selected:border-brand-600 data-selected:bg-brand-100',
						)}
						data-selected={isChecked || undefined}
						onclick={() => togglePreset(i)}
					>
						<div
							class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150 ease-out-expo"
							class:border-brand-600={isChecked}
							class:border-ink-300={!isChecked}
							class:bg-brand-600={isChecked}
						>
							{#if isChecked}
								<Check size={14} class="text-white" strokeWidth={3} />
							{/if}
						</div>
						<div class="flex flex-col gap-0.5 min-w-0">
							<p class="font-medium truncate">{preset.name}</p>
							<p class="text-sm text-ink-500 flex items-center gap-1">
								<RefreshCw size={14} class="text-ink-400 shrink-0" />
								{getIntervalSummary(
									{
										distanceInterval: preset.intervals[distanceUnit ?? 'mi'],
										monthInterval: preset.intervals.mo,
									},
									distanceUnit,
								)}
							</p>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	</form>

	{#snippet actions()}
		<Button type="button" variant="ghost" form={formId} onclick={() => onOpenChange(false)}
			>Cancel</Button
		>
		<Button type="submit" form={formId} disabled={checked.size === 0}>
			<Plus size={16} />
			Add {checked.size || undefined}
			{pluralize('task', checked.size)}
		</Button>
	{/snippet}
</Dialog>
