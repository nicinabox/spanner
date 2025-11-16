<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		type?: 'section';
	}

	let { type, ...props }: Props = $props();
</script>

<div
	{...props}
	role="separator"
	class={['bg-base-content/10', type === 'section' ? 'my-6 h-0.5' : 'h-px', props.class]}
></div>
