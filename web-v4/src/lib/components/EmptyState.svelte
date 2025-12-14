<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		heading: string;
		details: string;
		action?: Snippet;
		media?: Snippet;
	}

	let { heading, details, action, media }: Props = $props();
</script>

<div
	class="xs:p-10 mx-auto flex max-w-[40vw] min-w-fit flex-col items-center rounded-lg border bg-card p-8 text-center"
>
	{#if media}
		<div class="mb-8">
			{@render media()}
		</div>
	{/if}
	<h2 class="h1">{heading}</h2>
	<p>{details}</p>
	<div class="mt-6">
		{@render action?.()}
	</div>
</div>
