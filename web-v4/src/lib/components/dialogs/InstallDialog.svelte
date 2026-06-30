<script lang="ts">
	import { Button, Dialog } from '$lib';
	import { Download, Plus, Share } from 'lucide-svelte';
	import { isIOS } from '$lib/utils/install';
	import { browser } from '$app/env';
	import { triggerInstallPrompt } from '$lib/utils/install.svelte';

	interface Props {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}

	let { open = $bindable(false), onOpenChange }: Props = $props();

	const showInstall = $derived(browser && !isIOS());
	const showIOS = $derived(browser && isIOS());
</script>

<Dialog bind:open {onOpenChange} title="Install Spanner">
	{#if showInstall}
		<p>Add Spanner to your home screen for one-tap access.</p>
		<div class="mt-4 flex justify-end">
			<Button
				onclick={async () => {
					const outcome = await triggerInstallPrompt();
					if (outcome !== 'unavailable') open = false;
				}}
			>
				<Download size={16} />
				Install
			</Button>
		</div>
	{:else if showIOS}
		<p>Add Spanner to your home screen</p>

		<ol class="mt-4 space-y-2 leading-relaxed list-decimal list-inside">
			<li>
				Tap
				<Share size={14} class="inline -mt-0.5 text-ink-700" />
				<span class="font-semibold">Share</span>
			</li>
			<li>
				Tap
				<Plus size={14} class="inline -mt-0.5 text-ink-700" />
				<span class="font-semibold">Add to Home Screen</span>
			</li>
		</ol>
	{:else}
		<p>Open this page in Chrome on Android, or Safari on iPhone, to install.</p>
	{/if}
</Dialog>
