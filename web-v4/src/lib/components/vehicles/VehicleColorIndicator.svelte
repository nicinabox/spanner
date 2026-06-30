<script lang="ts">
	import { getColorPalette } from '$lib/utils/colors';

	interface Props {
		color?: string | null;
		size?: number;
	}

	let { color = '#cccccc', size = 7 }: Props = $props();

	let resolvedColor = $derived(color ?? '#cccccc');
	let palette = $derived(getColorPalette(resolvedColor));
	let background = $derived(`linear-gradient(0deg, ${palette[600]} 50%, ${resolvedColor} 50%)`);
</script>

<div
	class="rounded-full border-2 shrink-0"
	style="width: {size * 0.25}rem; height: {size *
		0.25}rem; background: {background}; border-color: {palette[400]};"
></div>
