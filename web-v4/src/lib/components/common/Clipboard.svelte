<script lang="ts">
	import * as clipboard from '@zag-js/clipboard';
	import { useMachine, normalizeProps } from '@zag-js/svelte';
	import InputGroup from './InputGroup.svelte';
	import { Check, Copy } from 'lucide-svelte';

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
</script>

<InputGroup
	variant="filled"
	name="clipboard"
	value={value}
	readonly
>
	{#snippet end()}
		<button
			{...triggerProps}
			type="button"
			tabindex="-1"
			aria-label={api.copied ? 'Copied' : 'Copy'}
			class="inline-flex items-center justify-center text-ink-500 cursor-pointer"
		>
			{#if api.copied}
				<Check size={14} />
			{:else}
				<Copy size={14} />
			{/if}
		</button>
	{/snippet}
</InputGroup>