<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card, { type CardSize, type CardVariant } from './common/Card.svelte';
	import { cn } from 'tailwind-variants';

	interface Props {
		heading: string;
		details?: string;
		action?: Snippet;
		media?: Snippet;
		class?: string;
		size?: CardSize;
		variant?: CardVariant;
	}

	let {
		heading,
		details,
		action,
		media,
		variant = 'outline',
		size = 'lg',
		class: className = '',
	}: Props = $props();
</script>

<Card
	{variant}
	{size}
	class={cn('mx-auto flex max-w-lg flex-col gap-0 items-center text-center', className)}
>
	{#if media}
		<div class="mb-8">
			{@render media()}
		</div>
	{/if}
	<h2
		class="group-data-[size=md]/card:text-xl group-data-[size=lg]/card:text-2xl font-semibold text-pretty"
	>
		{heading}
	</h2>
	{#if details}
		<p class="text-base text-ink-500 mt-2 text-pretty sm:group-data-[size=md]/card:max-w-3/5">
			{details}
		</p>
	{/if}
	{#if action}
		<div class="mt-6 flex gap-2">
			{@render action?.()}
		</div>
	{/if}
</Card>
