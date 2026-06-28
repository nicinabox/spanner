<script lang="ts">
	import { Button, Card, SegmentedControl, Textarea } from '$lib';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { NotepadText, Pencil } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { createInlineEnhance } from '$lib/utils/form';
	import { pageTitle } from '$lib/utils/site';

	let { data, form }: PageProps = $props();

	let vehicle = $derived(data.vehicle);

	let activeTab = $derived(
		$page.url.pathname === `/vehicles/${vehicle.id}/notes` ? 'notes' : 'history',
	);

	let view = $state<'edit' | 'preview' | 'saved'>('saved');
	let editing = $derived(view !== 'saved');

	let notesDraft = $state(vehicle.notes);
	let dirty = $derived(notesDraft !== vehicle.notes);
</script>

<svelte:head>
	<title>{pageTitle('Notes', data.vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout {vehicle} {activeTab}>
	<div class="max-w-2xl mx-auto">
		{#if vehicle.notes || editing}
			<Card variant="outline" bleed class="gap-4">
				<header class="flex items-center gap-2">
					{#if editing}
						<SegmentedControl
							items={[
								{ value: 'edit', label: 'Edit' },
								{ value: 'preview', label: 'Preview' },
							]}
							value={view}
							onValueChange={(d) => (view = d.value as 'edit' | 'preview')}
						/>

						<div class="ml-auto flex gap-2">
							<Button
								variant="ghost"
								onclick={() => {
									view = 'saved';
									notesDraft = vehicle.notes;
								}}
							>
								Cancel
							</Button>
							<Button form="notes-form" type="submit">
								Save Notes
								{#if dirty}
									<span class="size-1.5 rounded-full bg-ink-50/80"></span>
								{/if}
							</Button>
						</div>
					{:else}
						<Button class="ml-auto" variant="ghost" onclick={() => (view = 'edit')}>
							<Pencil size={16} />
							Edit
						</Button>
					{/if}
				</header>

				{#if view === 'saved'}
					<Markdown class="prose max-w-none dark:prose-invert" src={vehicle.notes} />
				{:else}
					<form
						hidden={view === 'preview'}
						id="notes-form"
						method="POST"
						action={`/vehicles/${vehicle.id}/edit?/update`}
						use:enhance={createInlineEnhance({
							onSuccess() {
								view = 'saved';
							},
						})}
					>
						<Textarea name="notes" bind:value={notesDraft} class="min-h-40 font-mono" />

						<p class="mt-1.5 text-sm text-ink-400">
							<a
								class="text-brand-500 underline"
								href="https://www.markdownguide.org/cheat-sheet/"
								target="_blank"
							>
								Markdown supported
							</a>
						</p>
					</form>

					{#if view === 'preview'}
						<Markdown class="prose max-w-none dark:prose-invert" src={notesDraft} />
					{/if}
				{/if}
			</Card>
		{:else}
			<EmptyState
				heading="Notes are for hard-to-remember things"
				details="Keep track of tire pressures, oil capacity, or how to reset the clock"
			>
				{#snippet media()}
					<NotepadText size={48} class="text-ink-300" />
				{/snippet}
				{#snippet action()}
					<Button onclick={() => (view = 'edit')}>
						<Pencil size={18} />
						Edit Notes
					</Button>
				{/snippet}
			</EmptyState>
		{/if}
	</div>
</VehiclePageLayout>
