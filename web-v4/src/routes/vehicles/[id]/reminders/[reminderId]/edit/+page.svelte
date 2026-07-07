<script lang="ts">
	import { Button, Card, Confirm } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import ReminderForm from '$lib/components/forms/ReminderForm.svelte';
	import { page } from '$app/stores';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data, form }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let reminder = $derived(data.reminder);

	let activeTab = $derived(
		$page.url.pathname === `/vehicles/${vehicle.id}/reminders/${reminder.id}/edit`
			? 'reminders'
			: 'reminders',
	);
</script>

<svelte:head>
	<title>{pageTitle('Edit Reminder', data.vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout
	{vehicle}
	{activeTab}
	backAction={{ href: `/vehicles/${vehicle.id}/reminders`, label: 'Back' }}
>
	<div class="max-w-2xl mx-auto">
		<Card variant="outline" bleed>
			<h1 class="text-xl font-semibold">Edit Reminder</h1>
			<ReminderForm {vehicle} {reminder} action="?/update" errors={form?.errors} />
		</Card>

		<Card class="mt-6" variant="outline" bleed>
			<h1 class="text-xl">Danger Zone</h1>

			<fieldset>
				<div class="flex items-center justify-between gap-6">
					<div>
						<span class="font-medium">Permanently delete</span>
						<p class="text-sm text-ink-500">This reminder will be permanently deleted.</p>
					</div>
					<Confirm title="Delete reminder?">
						{#snippet trigger({ onOpenChange })}
							<Button color="danger" variant="outline" onclick={() => onOpenChange(true)}
								>Delete</Button
							>
						{/snippet}
						{#snippet actions({ onOpenChange })}
							<form method="POST" action="?/delete" class="flex flex-row gap-2 flex-1 sm:flex-none">
								<Button
									type="submit"
									color="danger"
									variant="outline"
									class="flex-1 sm:flex-none"
									{...umamiEvent('delete_reminder')}>Delete</Button
								>
								<Button
									variant="solid"
									class="flex-1 sm:flex-none"
									onclick={() => onOpenChange(false)}
								>
									Cancel
								</Button>
							</form>
						{/snippet}
						<p>This reminder will be permanently deleted.</p>
					</Confirm>
				</div>
			</fieldset>
		</Card>
	</div>
</VehiclePageLayout>
