<script lang="ts">
	import * as dialog from '@zag-js/dialog';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';
	import { X } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: string;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		modal?: boolean;
		closeOnEscape?: boolean;
		closeOnInteractOutside?: boolean;
		id?: string;
	}

	let {
		children,
		title,
		open = $bindable(false),
		onOpenChange,
		modal = true,
		closeOnEscape = true,
		closeOnInteractOutside = true,
		id: idProp,
	}: Props = $props();

	let id = $props.id();
	let resolvedId = $derived(idProp ?? id);

	// svelte-ignore state_referenced_locally
	const service = useMachine(dialog.machine, {
		id: resolvedId,
		modal,
		closeOnEscape,
		closeOnInteractOutside,
		get open() {
			return open;
		},
		onOpenChange(details) {
			open = details.open;
			onOpenChange?.(details.open);
		},
	});

	const api = $derived(dialog.connect(service, normalizeProps));
</script>

{#if api.open}
	<div
		use:portal
		{...api.getBackdropProps()}
		class="fixed inset-0 z-50 bg-overlay/60"
		in:fade={{ duration: 120 }}
		out:fade={{ duration: 80 }}
	></div>
	<div
		use:portal
		{...api.getPositionerProps()}
		class="fixed inset-0 z-50 grid place-items-center p-4"
	>
		<div
			{...api.getContentProps()}
			class="relative flex flex-col w-full max-w-lg max-h-[90svh] rounded-xl bg-surface-raised shadow-lg border border-ink-200"
			in:scale={{ duration: 200, start: 0.95 }}
			out:scale={{ duration: 150, start: 0.95 }}
		>
			{#if title}
				<div class="flex items-center justify-between pl-8 pr-6 py-6">
					<h2 {...api.getTitleProps()} class="text-2xl font-semibold">{title}</h2>
					<button
						{...api.getCloseTriggerProps()}
						class="flex items-center justify-center rounded-sm p-1 text-ink-400 hover:text-ink-600 transition-colors"
					>
						<X size={18} />
					</button>
				</div>
			{/if}
			<div class="p-8 pt-0 overflow-auto flex-1" {...api.getDescriptionProps()}>
				{@render children()}
			</div>
		</div>
	</div>
{/if}
