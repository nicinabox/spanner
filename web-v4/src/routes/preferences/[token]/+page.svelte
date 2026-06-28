<script lang="ts">
	import { enhance } from '$app/forms';
	import AppIcon from '$lib/components/common/AppIcon.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import Switch from '$lib/components/common/Switch.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let isUnsubscribed = $derived(data.unsubscribedAt != null);
</script>

<svelte:head>
	<title>Manage notifications — Spanner</title>
</svelte:head>

<div class="flex min-h-screen max-w-2xl mx-auto flex-col gap-6 px-4 py-12">
	<div class="flex flex-col items-center gap-4">
		<AppIcon />
		<h1 class="text-2xl font-semibold">Manage notifications</h1>
	</div>

	{#if data.error}
		<Card variant="outline" class="text-center">
			<p class="text-negative">{data.error}</p>
		</Card>
	{:else}
		{#if data.vehicle}
			<Card variant="outline" bleed>
				<h2 class="text-lg font-semibold mb-4">{data.vehicle.name}</h2>

				{#if form?.error}
					<div role="alert" class="p-3 mb-4 rounded-md bg-negative/10 text-negative text-sm">
						{form.error}
					</div>
				{:else if form?.success}
					<div role="status" class="p-3 mb-4 rounded-md bg-positive/10 text-positive text-sm">
						Preferences saved.
					</div>
				{/if}

				<form method="POST" action="?/update" use:enhance class="flex flex-col gap-4">
					<input type="hidden" name="vehicle_id" value={data.vehicle.id} />

					<Switch
						name="send_reminder_emails"
						defaultChecked={data.vehicle.preferences.sendReminderEmails}
						class="flex-row-reverse w-full justify-between gap-6"
					>
						<div>
							<span class="font-medium">Send reminder emails</span>
							<p class="text-sm text-ink-500 font-normal">
								Receive an email for upcoming reminders 2 weeks before and on the due date.
							</p>
						</div>
					</Switch>

					<Switch
						name="send_prompt_for_records"
						defaultChecked={data.vehicle.preferences.sendPromptForRecords}
						class="flex-row-reverse w-full justify-between gap-6"
					>
						<div>
							<span class="font-medium">Send prompt for records email</span>
							<p class="text-sm text-ink-500 font-normal">
								Receive a weekly prompt asking you to log a record.
							</p>
						</div>
					</Switch>

					<Button type="submit">Save preferences</Button>
				</form>
			</Card>
		{/if}

		<Card variant="outline" bleed>
			<h2 class="text-lg font-semibold mb-2">All emails</h2>
			<p class="text-sm text-ink-500 mb-4">
				{isUnsubscribed
					? 'You are currently unsubscribed from all Spanner emails.'
					: 'Stop receiving all reminder and prompt emails from Spanner.'}
			</p>

			{#if isUnsubscribed}
				<form method="POST" action="?/reactivate" use:enhance>
					<Button type="submit">Reactivate</Button>
				</form>
			{:else}
				<form method="POST" action="?/unsubscribe" use:enhance>
					<Button type="submit" danger>Unsubscribe from all</Button>
				</form>
			{/if}
		</Card>
	{/if}
</div>