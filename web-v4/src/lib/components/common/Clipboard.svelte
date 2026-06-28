<script lang="ts">
	import * as clipboard from '@zag-js/clipboard';
	import { useMachine, normalizeProps } from '@zag-js/svelte';
	import InputGroup from './InputGroup.svelte';
	import { Check, Copy } from 'lucide-svelte';
	import Button from './Button.svelte';
	import Tooltip from './Tooltip.svelte';

	interface Props {
		value: string;
		timeout?: number;
		id?: string;
	}

	let { value, timeout = 2000, id: idProp }: Props = $props();

	let id = $props.id();
	let resolvedId = $derived(idProp ?? id);

	const service = useMachine(clipboard.machine, {
		id: resolvedId,
		value,
		timeout,
	});

	const api = $derived(clipboard.connect(service, normalizeProps));
	const triggerProps = $derived(api.getTriggerProps() as Record<string, unknown>);

	let label = $derived(api.copied ? 'Copied' : 'Copy');
</script>

<InputGroup variant="filled" name="clipboard" {value} readonly>
	{#snippet end()}
		<Tooltip content={label}>
			{#snippet children(tooltipProps)}
				<Button
					{...tooltipProps}
					{...triggerProps}
					aria-label={label}
					class="-mr-2"
					variant="ghost"
					color="neutral"
					size="sm"
					icon
				>
					{#if api.copied}
						<Check size={14} />
					{:else}
						<Copy size={14} />
					{/if}
				</Button>
			{/snippet}
		</Tooltip>
	{/snippet}
</InputGroup>
