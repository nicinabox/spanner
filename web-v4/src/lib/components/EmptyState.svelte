<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card, { type CardSize } from './common/Card.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		heading: string;
		details?: string;
		action?: Snippet;
		media?: Snippet;
		class?: string;
		size?: CardSize;
	}

	let { heading, details, action, media, size = 'lg', class: className = '' }: Props = $props();
</script>

<Card
	variant="outline"
	{size}
	class={cn('mx-auto flex max-w-lg flex-col gap-0 items-center text-center', className)}
>
	{#if media}
		<div class="mb-8">
			{@render media()}
		</div>
	{/if}
	<h2 class="group-data-[size=md]:text-xl group-data-[size=lg]:text-2xl font-semibold text-pretty">
		{heading}
	</h2>
	{#if details}
		<p class="text-base text-ink-500 mt-2 text-pretty">{details}</p>
	{/if}
	{#if action}
		<div class="mt-6 flex gap-2">
			{@render action?.()}
		</div>
	{/if}
</Card>
