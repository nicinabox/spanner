<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		heading: string;
		details: string;
		action?: Snippet;
	}

	let { heading, details, action }: Props = $props();
</script>

<div class="flex flex-col items-center p-8">
	<h2 class="h1">{heading}</h2>
	<p>{details}</p>
	<div class="mt-6">
		{@render action?.()}
	</div>
</div>
