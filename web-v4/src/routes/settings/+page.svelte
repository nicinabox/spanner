<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft } from 'lucide-svelte';
	import { Button, Card, Confirm, Field, Input, PageLayout } from '$lib';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data, form }: PageProps = $props();

	let emailSuccess = $derived(form?.emailSuccess);
	let newEmail = $derived(form?.email ?? '');
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
				<div class="bg-positive/10 text-positive rounded-md p-4 mb-4">
					Confirmation emails sent to <strong>{newEmail}</strong> and <strong>{data.email}</strong>.
					Click the link in either email to confirm the change.
				</div>
			{/if}
			<form method="post" action="?/changeEmail" use:enhance>
					<fieldset class="fieldset">
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
						<Button type="submit">Update email</Button>
					</div>
				</form>
		</Card>

		<Card class="mt-6" variant="outline" bleed heading={data.passwordEnabled ? 'Change password' : 'Set a password'}>
			{#if form?.passwordSuccess}
				<div class="bg-positive/10 text-positive rounded-md p-4 mb-4">
					{#if data.passwordEnabled}
						Your password has been updated.
					{:else}
						Your password has been set. You can now sign in with email + password or continue using magic links.
					{/if}
				</div>
			{/if}
			<form method="post" action="?/changePassword" use:enhance>
					<fieldset class="fieldset">
						<Field name="password" label={data.passwordEnabled ? 'New password' : 'Password'} errors={form?.errors} required>
							<Input name="password" type="password" autocomplete="new-password" required />
						</Field>
						<Field name="confirm_password" label="Confirm password" errors={form?.errors} required>
							<Input name="confirm_password" type="password" autocomplete="new-password" required />
						</Field>
					</fieldset>
					<div class="mt-2">
						<Button type="submit">{data.passwordEnabled ? 'Update password' : 'Set password'}</Button>
					</div>
				</form>
		</Card>

		<Card class="mt-6" variant="outline" bleed heading="Delete Account">
			<fieldset>
				<div class="flex items-center justify-between gap-6">
					<div>
						<span class="font-medium">Permanently delete your account</span>
						<p class="text-sm text-ink-500">
							Your vehicles, records, and all data will be deleted. You can sign in again within 30
							days to restore your account.
						</p>
					</div>
					<Confirm title="Delete account?">
						{#snippet trigger({ onOpenChange })}
							<Button danger onclick={() => onOpenChange(true)}>Delete</Button>
						{/snippet}
						{#snippet actions({ onOpenChange })}
							<form method="post" class="flex flex-row gap-2 flex-1 sm:flex-none">
								<Button type="submit" formaction="?/delete" danger class="flex-1 sm:flex-none"
									>Delete Account</Button
								>
								<Button
									variant="outline"
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
