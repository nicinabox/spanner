<script lang="ts">
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { HelpCircle, NotebookPen } from 'lucide-svelte';

	interface Props {
		vehicle: Vehicle;
	}

	const { vehicle }: Props = $props();

	let view = $state<'edit' | 'preview' | 'saved'>('saved');
	let editing = $derived(view !== 'saved');

	let form = $state({
		notes: vehicle.notes
	});
	let dirty = $derived(form.notes !== vehicle.notes);
	let notes = $derived.by(() => {
		if (view === 'saved') {
			return vehicle.notes;
		}
		return form.notes;
	});
</script>

{#if vehicle.notes}
	<header class="space-between my-8 flex items-center">
		{#if editing}
			<div class="flex h-fit rounded-lg border bg-secondary p-0.5">
				<Button
					size="sm"
					aria-selected={view === 'edit'}
					variant={view === 'edit' ? 'default' : 'ghost'}
					onclick={() => (view = 'edit')}
				>
					Edit
				</Button>
				<Button
					size="sm"
					aria-selected={view === 'preview'}
					variant={view === 'preview' ? 'default' : 'ghost'}
					onclick={() => (view = 'preview')}
				>
					Preview
				</Button>
			</div>

			<div class="ml-auto flex gap-2">
				<Button
					variant="outline"
					onclick={() => {
						view = 'saved';
						form.notes = vehicle.notes;
					}}
				>
					Cancel
				</Button>
				<Button class="ml-auto" form="notes-form" type="submit">
					Save Notes
					{#if dirty}
						<div class="size-1.5 rounded-full bg-secondary/80"></div>
					{/if}
				</Button>
			</div>
		{:else}
			<Button class="ml-auto" onclick={() => (view = 'edit')}>
				<NotebookPen size={16} />
				Edit
			</Button>
		{/if}
	</header>

	{#if view === 'saved'}
		<Markdown
			class="mx-auto prose max-w-none dark:prose-invert prose-h1:text-3xl"
			src={vehicle.notes}
		/>
	{:else}
		<form
			hidden={view === 'preview'}
			id="notes-form"
			method="POST"
			action={`/vehicles/${vehicle.id}/edit?/update`}
		>
			<div class="grid-textarea-autosize">
				<div data-textarea-clone class="font-mono">
					{form.notes}
				</div>
				<Textarea name="notes" bind:value={form.notes} class="font-mono" />
			</div>

			<span class="mt-1.5 inline-block px-3.5 text-sm">
				<a
					class="text-primary underline"
					href="https://www.markdownguide.org/cheat-sheet/"
					target="_blank"
				>
					Markdown supported
				</a>
			</span>
		</form>

		<Markdown
			hidden={view === 'edit'}
			class="mx-auto prose max-w-none dark:prose-invert prose-h1:text-3xl"
			src={notes}
		/>
	{/if}
{:else}
	<EmptyState
		heading="Notes are for hard-to-remember things"
		details="Add tire pressures, oil capacity, or how to reset the clock."
	/>
{/if}
