<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/common/Alert.svelte';
	import AppIcon from '$lib/components/common/AppIcon.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import Switch from '$lib/components/common/Switch.svelte';
	import { pageTitle } from '$lib/utils/site';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let isUnsubscribed = $derived(data.unsubscribedAt != null);
</script>

<svelte:head>
	<title>{pageTitle('Manage notifications')}</title>
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
				<h2 class="text-lg font-bold">{data.vehicle.name}</h2>

				{#if form?.error}
					<Alert role="alert" variant="negative">
						{form.error}
					</Alert>
				{:else if form?.success}
					<Alert role="status" variant="positive">Preferences saved.</Alert>
				{/if}

				<form
					method="POST"
					action="?/update"
					use:enhance={() => {
						return async ({ update }) => {
							await update({ reset: false });
						};
					}}
					class="flex flex-col gap-6"
				>
					<input type="hidden" name="vehicle_id" value={data.vehicle.id} />

					<fieldset class="flex flex-col gap-4">
						{#key data.vehicle.preferences}
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
						{/key}
					</fieldset>

					<div class="flex gap-3">
						<Button type="submit" class="grow-0">Save preferences</Button>
					</div>
				</form>
			</Card>
		{/if}

		<Card variant="outline" bleed>
			<h2 class="text-lg font-bold">All email notifications</h2>

			{#if isUnsubscribed}
				<p>You are currently unsubscribed from all Spanner emails.</p>
				<form method="POST" action="?/reactivate" use:enhance>
					{#if data.vehicle?.id}
						<input type="hidden" name="vehicle_id" value={data.vehicle.id} />
					{/if}
					<Button type="submit">Reactivate</Button>
				</form>
			{:else}
				<p>Stop receiving reminder emails for all vehicles.</p>
				<form method="POST" action="?/unsubscribe" use:enhance>
					{#if data.vehicle?.id}
						<input type="hidden" name="vehicle_id" value={data.vehicle.id} />
					{/if}
					<Button type="submit" danger>Unsubscribe from all</Button>
				</form>
			{/if}
		</Card>
	{/if}
</div>
