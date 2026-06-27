<script lang="ts">
	import * as tooltip from '@zag-js/tooltip';
	import { useMachine, normalizeProps } from '@zag-js/svelte';
	import { scale } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	type Placement =
		| 'top'
		| 'bottom'
		| 'left'
		| 'right'
		| 'top-start'
		| 'top-end'
		| 'bottom-start'
		| 'bottom-end';

	interface Props {
		content: string;
		children: Snippet<[Record<string, unknown>]>;
		placement?: Placement;
		openDelay?: number;
		closeDelay?: number;
		disabled?: boolean;
		interactive?: boolean;
		closeOnClick?: boolean;
		id?: string;
	}

	let {
		content,
		children,
		placement = 'top',
		openDelay = 0,
		closeDelay = 0,
		disabled,
		interactive,
		closeOnClick,
		id: idProp,
	}: Props = $props();

	let id = $props.id();
	let resolvedId = $derived(idProp ?? id);

	const service = useMachine(tooltip.machine, {
		id: resolvedId,
		openDelay,
		closeDelay,
		disabled,
		interactive,
		closeOnClick,
		positioning: { placement },
	});

	const api = $derived(tooltip.connect(service, normalizeProps));
</script>

<div>
	{@render children(api.getTriggerProps() as Record<string, unknown>)}
</div>
{#if api.open}
	<div {...api.getPositionerProps()}>
		<div
			{...api.getContentProps()}
			class="px-2.5 py-1.5 text-xs rounded-[4px] bg-ink-900 text-ink-50 shadow-sm"
			in:scale={{ duration: 150, start: 0.95 }}
			out:scale={{ duration: 100, start: 0.95 }}
		>
			{content}
		</div>
	</div>
{/if}
