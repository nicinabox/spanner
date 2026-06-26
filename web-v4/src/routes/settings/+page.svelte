<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Confirm, Field, Input, PageLayout } from '$lib';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data, form }: PageProps = $props();

	let success = $derived(form?.success);
	let newEmail = $derived(form?.email ?? '');
</script>

<svelte:head>
	<title>{pageTitle('Settings')}</title>
</svelte:head>

<PageLayout>
	<div class="max-w-xl mx-auto">
		<h1 class="text-2xl font-semibold mb-6">Settings</h1>

		<Card variant="outline" bleed heading="Change email">
			<div>
				<label for="">Current</label>
				<p>
					{data.email}
				</p>
			</div>

			{#if success}
				<div class="bg-positive/10 text-positive rounded-md p-4">
					Confirmation emails sent to <strong>{newEmail}</strong> and <strong>{data.email}</strong>.
					Click the link in either email to confirm the change.
				</div>
			{:else}
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
			{/if}
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
