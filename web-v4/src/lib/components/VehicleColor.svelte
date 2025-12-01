<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ClassValue } from 'clsx';

	interface Props {
		color: string;
		class?: ClassValue;
	}

	let { color, class: className }: Props = $props();
</script>

<div
	class={cn('size-8 shrink-0 rounded-full bg-(--color)', className)}
	style={`--color: ${color};`}
></div>
