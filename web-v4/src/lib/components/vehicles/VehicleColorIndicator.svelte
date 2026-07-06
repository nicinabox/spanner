<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { getColorPalette } from '$lib/utils/colors';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		color?: string | null;
		size?: number;
		class?: ClassValue;
	}

	let { color = '#cccccc', size = 7, ...props }: Props = $props();

	let resolvedColor = $derived(color ?? '#cccccc');
	let palette = $derived(getColorPalette(resolvedColor));
	let background = $derived(`linear-gradient(0deg, ${palette[600]} 50%, ${resolvedColor} 50%)`);
</script>

<div
	class={cn(
		'rounded-full border-2 shrink-0',
		'size-(--size) bg-(image:--background) border-(--border)',
		props.class,
	)}
	style:--size={size * 0.25 + 'rem'}
	style:--background={background}
	style:--border={palette[400]}
></div>
