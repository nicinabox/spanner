<script lang="ts">
	import { Button } from '$lib';
	import InstallDialog from '$lib/components/dialogs/InstallDialog.svelte';
	import { Download } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { browser } from '$app/environment';
	import { initInstallPrompt, triggerInstallPrompt } from '$lib/utils/install.svelte';

	let open = $state(false);

	const isTouch = new MediaQuery('(pointer: coarse)');
	const isStandaloneDisplay = new MediaQuery('(display-mode: standalone)');

	const canShow = $derived(browser && !isStandaloneDisplay.current && isTouch.current);

	onMount(() => {
		initInstallPrompt();
	});
</script>

{#if canShow}
	<Button
		size="sm"
		color="neutral"
		theme="dark"
		onclick={async () => {
			const outcome = await triggerInstallPrompt();
			if (outcome === 'unavailable') {
				open = true;
			}
		}}
	>
		<Download size={16} />
		Install
	</Button>
{/if}

<InstallDialog bind:open />
