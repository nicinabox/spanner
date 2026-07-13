<script lang="ts">
	import { enhance } from '$app/forms';
	import { umamiEvent } from '$lib/umami';
	import { ArrowLeft, Check } from 'lucide-svelte';
	import {
		Button,
		Card,
		Confirm,
		Field,
		Input,
		PageLayout,
		Alert,
		InputGroup,
		InputAddon,
	} from '$lib';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data, form }: PageProps = $props();

	let emailSuccess = $derived(form?.emailSuccess);
	let newEmail = $derived(form?.email ?? '');
	let webhookSuccess = $derived(form?.webhookSuccess);
	let webhookTestSuccess = $state(false);
	// svelte-ignore state_referenced_locally
	let webhookUrl = $state(data.webhookUrl);
</script>

<svelte:head>
	<title>{pageTitle('Settings')}</title>
</svelte:head>

<PageLayout>
	{#snippet appbarStart()}
		<Button size="sm" href="/vehicles" color="neutral" theme="dark">
			<ArrowLeft size={16} /> Vehicles
		</Button>
	{/snippet}

	<div class="max-w-xl mx-auto">
		<h1 class="text-2xl font-semibold mb-6">Settings</h1>

		<Card variant="outline" bleed heading="Change email">
			<div>
				<label for="">Current</label>
				<p>
					{data.email}
				</p>
			</div>

			{#if emailSuccess}
				<Alert variant="positive" class="mb-4">
					Confirmation emails sent to <strong>{newEmail}</strong> and <strong>{data.email}</strong>.
					Click the link in either email to confirm the change.
				</Alert>
			{/if}
			<form method="post" action="?/changeEmail" use:enhance>
				<fieldset>
					<Field
						name="email"
						label="New email"
						hint="We'll send confirmation links to both your current and new address."
						errors={form?.errors}
						required
					>
						<Input name="email" type="email" autocomplete="email" required />
					</Field>
				</fieldset>

				<div class="mt-2">
					<Button type="submit" {...umamiEvent('update_email')}>Update email</Button>
				</div>
			</form>
		</Card>

		<Card
			class="mt-6"
			variant="outline"
			bleed
			heading={data.passwordEnabled ? 'Change password' : 'Set a password'}
		>
			{#if form?.passwordSuccess}
				<Alert variant="positive" class="mb-4">
					{#if data.passwordEnabled}
						Your password has been updated.
					{:else}
						Your password has been set. You can now sign in with email + password or continue using
						magic links.
					{/if}
				</Alert>
			{/if}
			<form method="post" action="?/changePassword" use:enhance>
				<fieldset>
					<Field
						name="password"
						label={data.passwordEnabled ? 'New password' : 'Password'}
						errors={form?.errors}
						required
					>
						<Input name="password" type="password" autocomplete="new-password" required />
					</Field>
					<Field name="confirm_password" label="Confirm password" errors={form?.errors} required>
						<Input name="confirm_password" type="password" autocomplete="new-password" required />
					</Field>
				</fieldset>
				<div class="mt-2">
					<Button type="submit" {...umamiEvent('update_password')}
						>{data.passwordEnabled ? 'Update password' : 'Set password'}</Button
					>
				</div>
			</form>
		</Card>

		<Card class="mt-6" variant="outline" bleed heading="Webhook URL">
			{#if webhookSuccess}
				<Alert variant="positive" class="mb-4">Webhook URL updated.</Alert>
			{/if}
			<form
				method="post"
				action="?/updateWebhook"
				use:enhance={() =>
					async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							webhookUrl = (result.data as { webhookUrl: string }).webhookUrl;
						}
					}}
			>
				<fieldset>
					<Field
						name="webhookUrl"
						label="Webhook URL"
						hint="Receive notifications via webhook (e.g. ntfy.sh)."
						errors={form?.errors}
					>
						<InputGroup>
							<Input
								bind:value={webhookUrl}
								name="webhookUrl"
								type="url"
								oninput={() => (webhookSuccess = false)}
								autocomplete="off"
							/>

							{#if webhookUrl}
								<InputAddon>
									{#if webhookTestSuccess}
										<Check size={16} class="text-positive" />
									{:else}
										<Button
											type="submit"
											variant="ghost"
											color="neutral"
											size="sm"
											onclick={async (e: Event) => {
												e.preventDefault();
												const { testWebhook } = await import('./webhook.remote.ts');
												try {
													await testWebhook();
													webhookTestSuccess = true;
													setTimeout(() => (webhookTestSuccess = false), 2000);
												} catch {}
											}}
										>
											Test
										</Button>
									{/if}
								</InputAddon>
							{/if}
						</InputGroup>
					</Field>
				</fieldset>

				<div class="mt-2 flex gap-2">
					<Button type="submit">Save webhook URL</Button>
					<Button
						type="button"
						variant="outline"
						onclick={() => {
							const random = Array.from({ length: 12 }, () =>
								'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 36)),
							).join('');
							webhookUrl = `https://ntfy.sh/spanner-${random}`;
						}}
					>
						Generate URL
					</Button>
				</div>
			</form>
		</Card>

		<Card class="mt-6" variant="outline" bleed heading="Danger Zone">
			<fieldset>
				<div class="flex items-center justify-between gap-6">
					<div>
						<span class="font-medium">Permanently delete account</span>
						<p class="text-sm text-ink-500">
							Your vehicles, records, and all data will be deleted. You can sign in again within 30
							days to restore your account.
						</p>
					</div>
					<Confirm title="Delete account?">
						{#snippet trigger({ onOpenChange })}
							<Button color="danger" variant="outline" onclick={() => onOpenChange(true)}
								>Delete Account</Button
							>
						{/snippet}
						{#snippet actions({ onOpenChange })}
							<form method="post" class="flex flex-row gap-2 flex-1 sm:flex-none">
								<Button
									type="submit"
									formaction="?/delete"
									color="danger"
									variant="outline"
									class="flex-1 sm:flex-none"
									{...umamiEvent('delete_account')}>Delete Account</Button
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
						<p>
							This will immediately delete your account and sign you out. You have 30 days to sign
							in again to restore your data.
						</p>
					</Confirm>
				</div>
			</fieldset>
		</Card>
	</div>
</PageLayout>
