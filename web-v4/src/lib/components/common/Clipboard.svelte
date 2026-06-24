<script lang="ts">
	import * as clipboard from '@zag-js/clipboard';
	import { useMachine, normalizeProps } from '@zag-js/svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { Check, Copy } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import Tooltip from './Tooltip.svelte';

	interface Props {
		value: string;
		children?: Snippet;
		timeout?: number;
		id?: string;
	}

	let { value, children, timeout = 2000, id: idProp }: Props = $props();

	let id = $props.id();
	let resolvedId = $derived(idProp ?? id);

	const service = useMachine(clipboard.machine, {
		id: resolvedId,
		value,
		timeout,
	});

	const api = $derived(clipboard.connect(service, normalizeProps));
</script>

<div {...api.getRootProps()} class="inline-flex items-center gap-2">
	{#if children}
		{@render children()}
	{/if}
	<Tooltip content="Copy">
		{#snippet children(props)}
			<Button
				{...props}
				{...api.getTriggerProps() as Record<string, unknown>}
				icon
				aria-label={api.copied ? 'Copied' : 'Copy'}
				variant="tertiary"
			>
				{#if api.copied}
					<Check size={14} />
				{:else}
					<Copy size={14} />
				{/if}
			</Button>
		{/snippet}
	</Tooltip>
</div>
