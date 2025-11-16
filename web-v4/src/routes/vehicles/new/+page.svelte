<script lang="ts">
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import { type VehiclePreferences } from '$lib/data/vehicles';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="container mx-auto max-w-xl">
	<VehicleForm
		{form}
		values={{
			preferences: {
				enableCost: true,
				sendPromptForRecords: true,
				sendReminderEmails: true
			} as VehiclePreferences
		}}
	/>
</div>
