<script lang="ts">
	import * as dialog from '@zag-js/dialog';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';
	import { X } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: string;
		description?: string;
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
		description,
		open = $bindable(false),
		onOpenChange,
		modal = true,
		closeOnEscape = true,
		closeOnInteractOutside = true,
		id: idProp,
	}: Props = $props();

	let id = $props.id();
	let resolvedId = $derived(idProp ?? id);

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
			class="relative w-full max-w-lg rounded-lg bg-surface-raised shadow-lg"
			in:scale={{ duration: 200, start: 0.95 }}
			out:scale={{ duration: 150, start: 0.95 }}
		>
			{#if title}
				<div class="flex items-center justify-between px-6 py-4">
					<h2 {...api.getTitleProps()} class="text-xl font-semibold">{title}</h2>
					<button
						{...api.getCloseTriggerProps()}
						class="flex items-center justify-center rounded-sm p-1 -mr-1 text-ink-400 hover:text-ink-600 transition-colors"
					>
						<X size={18} />
					</button>
				</div>
			{/if}
			{#if description}
				<p {...api.getDescriptionProps()} class="px-6 pt-2 text-sm text-ink-500">{description}</p>
			{/if}
			<div class="p-6 pt-0">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
