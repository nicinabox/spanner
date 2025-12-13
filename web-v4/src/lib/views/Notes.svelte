<script lang="ts">
	import { page } from '$app/state';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { NotebookPen } from 'lucide-svelte';

	interface Props {
		vehicle: Vehicle;
	}

	const { vehicle }: Props = $props();
</script>

{#if vehicle.notes}
	<header class="my-8 flex">
		<Button class="ml-auto" href={`/vehicles/${page.params.id}/edit?view=notes`}>
			<NotebookPen size={16} />
			Edit
		</Button>
	</header>
	<Markdown class="mx-auto prose dark:prose-invert prose-h1:text-3xl" src={vehicle.notes} />
{:else}
	<EmptyState
		heading="Notes are for hard-to-remember things"
		details="Add tire pressures, oil capacity, or how to reset the clock."
	/>
{/if}
