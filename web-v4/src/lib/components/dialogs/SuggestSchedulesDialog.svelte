<script lang="ts">
	import { Button } from '$lib';
	import Dialog from '$lib/components/common/Dialog.svelte';
	import { enhance } from '$app/forms';
	import { getPresets } from '$lib/data/serviceSchedules.remote';
	import { Check, Sparkles } from 'lucide-svelte';

	interface Preset {
		name: string;
		distance_interval: number | null;
		month_interval: number | null;
	}

	interface Props {
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}

	let { open, onOpenChange }: Props = $props();

	let presets: Record<string, Preset[]> | null = $state(null);
	let loading = $state(true);
	let selectedType = $state<string | null>(null);
	let checked = $state<Set<number>>(new Set());

	$effect(() => {
		if (open) {
			loading = true;
			selectedType = null;
			checked = new Set();
			getPresets({}).then((data) => {
				presets = data;
				loading = false;
			});
		}
	});

	const currentPresets: Preset[] = $derived(
		selectedType && presets ? presets[selectedType] ?? [] : [],
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

	const selectedNames: string[] = $derived(
		[...checked].map((i) => currentPresets[i]?.name).filter(Boolean) as string[],
	);
</script>

<Dialog {open} {onOpenChange} title="Suggest Schedules" description="Pick a vehicle type to see suggested schedules">
	<form method="POST" action="?/suggest" use:enhance>
		{#if loading}
			<p class="text-ink-400 text-center py-8">Loading presets...</p>
		{:else if !selectedType}
			<div class="grid grid-cols-2 gap-3">
				{#each Object.keys(presets ?? {}) as type}
					<button
						type="button"
						class="p-4 rounded-lg border border-ink-300 hover:border-ink-500 text-left"
						onclick={() => (selectedType = type)}
					>
						<p class="font-medium capitalize">{type}</p>
						<p class="text-sm text-ink-400">{presets?.[type]?.length ?? 0} schedules</p>
					</button>
				{/each}
			</div>
		{:else}
			<input type="hidden" name="preset_names" value={JSON.stringify(selectedNames)} />
			<p class="text-ink-500 mb-4 capitalize">Suggested schedules for {selectedType}:</p>
			<ul class="space-y-2 mb-4">
				{#each currentPresets as preset, i}
					<li>
						<button
							type="button"
							class="w-full flex items-center gap-3 p-3 rounded-lg border text-left"
							class:border-ink-500={checked.has(i)}
							class:border-ink-200={!checked.has(i)}
							onclick={() => togglePreset(i)}
						>
							<div
								class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
								class:border-ink-500={checked.has(i)}
								class:border-ink-300={!checked.has(i)}
								class:bg-ink-500={checked.has(i)}
							>
								{#if checked.has(i)}
									<Check size={14} class="text-white" />
								{/if}
							</div>
							<div>
								<p class="font-medium">{preset.name}</p>
								<p class="text-sm text-ink-400">
									{preset.distance_interval ? `every ${preset.distance_interval.toLocaleString()} mi` : ''}
									{preset.distance_interval && preset.month_interval ? ' or ' : ''}
									{preset.month_interval ? `every ${preset.month_interval} mo` : ''}
								</p>
							</div>
						</button>
					</li>
				{/each}
			</ul>
			<div class="flex justify-end gap-2">
				<Button type="button" variant="ghost" onclick={() => (selectedType = null)}>Back</Button>
				<Button type="submit" disabled={checked.size === 0}>
					<Sparkles size={16} />
					Create {checked.size} schedule{checked.size !== 1 ? 's' : ''}
				</Button>
			</div>
		{/if}
	</form>
</Dialog>
