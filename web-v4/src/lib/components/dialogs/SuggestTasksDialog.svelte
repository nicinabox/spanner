<script lang="ts">
	import { Button } from '$lib';
	import Dialog from '$lib/components/common/Dialog.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getPresets, type Preset } from '$lib/data/serviceSchedules.remote';
	import { Check, Plus, RefreshCw } from 'lucide-svelte';

	interface Props {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		existingClassificationNames?: Set<string>;
		initialType?: string | null;
	}

	let { open, onOpenChange, existingClassificationNames = new Set(), initialType = null }: Props = $props();

	let presets: Record<string, Preset[]> | null = $state(null);
	let loading = $state(true);
	let checked = $state<Set<number>>(new Set());

	$effect(() => {
		if (open) {
			loading = true;
			checked = new Set();
			getPresets({}).then((data) => {
				presets = data;
				loading = false;
			});
		}
	});

	const currentPresets: Preset[] = $derived(
		initialType && presets ? (presets[initialType] ?? []) : [],
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

	const selectedNames: string[] = $derived([
		...new Set([...checked].map((i) => currentPresets[i]?.name).filter(Boolean)),
	] as string[]);

	const isExisting = (name: string) => existingClassificationNames.has(name.toLowerCase());
	const submit: SubmitFunction = () => {
		return async ({
			result,
			update,
		}: {
			result: { type: string };
			update: (opts?: { reset?: boolean; invalidateAll?: boolean }) => Promise<void>;
		}) => {
			if (result.type === 'success' || result.type === 'redirect') {
				onOpenChange(false);
			}
			await update();
		};
	};
	const title = $derived(initialType ? `${initialType.charAt(0).toUpperCase() + initialType.slice(1)} Tasks` : 'Common Tasks');
	const formId = 'suggest-form';
</script>

<Dialog {open} {onOpenChange} title={title}>
	<form id={formId} method="POST" action="?/suggest" use:enhance={submit}>
		{#if loading}
			<p class="text-ink-400 text-center py-8">Loading presets...</p>
		{:else}
			<input type="hidden" name="preset_names" value={JSON.stringify(selectedNames)} />
			<p class="mb-4">Common tasks for {initialType}s. You can edit them any time.</p>
			<ul class="space-y-2">
				{#each currentPresets as preset, i}
					{@const existing = isExisting(preset.name)}
					{@const isChecked = checked.has(i) || existing}
					<li>
						<button
							type="button"
							disabled={existing}
							class="w-full flex items-center gap-4 px-4 py-3 rounded-lg border text-left transition-all duration-150 ease-out-expo cursor-pointer"
							class:border-brand-600={isChecked}
							class:border-ink-200={!isChecked}
							class:opacity-40={existing}
							class:hover:border-ink-400={!existing && !isChecked}
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
									{preset.distanceInterval
										? `${preset.distanceInterval.toLocaleString()} mi`
										: ''}
									{preset.distanceInterval && preset.monthInterval ? ' or ' : ''}
									{preset.monthInterval ? `${preset.monthInterval} mo` : ''}
								</p>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</form>

	{#snippet actions()}
		<Button type="button" variant="ghost" form={formId} onclick={() => onOpenChange(false)}>Cancel</Button>
		<Button type="submit" form={formId} disabled={checked.size === 0}>
			<Plus size={16} />
			Add {checked.size} task{checked.size !== 1 ? 's' : ''}
		</Button>
	{/snippet}
</Dialog>
