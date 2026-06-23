<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from './common/Card.svelte';

	interface Props {
		heading: string;
		details: string;
		action?: Snippet;
		media?: Snippet;
	}

	let { heading, details, action, media }: Props = $props();
</script>

<Card
	variant="outline"
	size="lg"
	class="mx-auto flex max-w-md flex-col gap-0 items-center text-center"
>
	{#if media}
		<div class="mb-8">
			{@render media()}
		</div>
	{/if}
	<h2 class="text-2xl font-semibold">{heading}</h2>
	<p class="text-base text-ink-500 mt-2">{details}</p>
	<div class="mt-6">
		{@render action?.()}
	</div>
</Card>
