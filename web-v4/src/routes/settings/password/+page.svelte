<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft } from 'lucide-svelte';
	import { Button, Card, Field, Input, PageLayout } from '$lib';
	import { pageTitle } from '$lib/utils/site';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let hasPassword = $derived(data.passwordEnabled);
	let showSuccess = $derived(form?.success);
</script>

<svelte:head>
	<title>{pageTitle('Password Settings')}</title>
</svelte:head>

<PageLayout>
	{#snippet appbarStart()}
		<Button size="sm" href="/settings" color="neutral" theme="dark">
			<ArrowLeft size={16} /> Settings
		</Button>
	{/snippet}

	<div class="max-w-xl mx-auto">
		<h1 class="text-2xl font-semibold mb-6">Password</h1>

		{#if showSuccess}
			<div class="bg-positive/10 text-positive rounded-md p-4 mb-6">
				{#if hasPassword}
					Your password has been updated.
				{:else}
					Your password has been set. You can now sign in with email + password or continue using magic links.
				{/if}
			</div>
		{/if}

		<Card variant="outline" bleed heading={hasPassword ? 'Change password' : 'Set a password'}>
			<form method="post" action="?/set" use:enhance class="mt-2">
				<fieldset class="fieldset">
					<Field name="password" label={hasPassword ? 'New password' : 'Password'} errors={form?.errors} required>
						<Input name="password" type="password" autocomplete="new-password" required />
					</Field>
					<Field name="confirm_password" label="Confirm password" errors={form?.errors} required>
						<Input name="confirm_password" type="password" autocomplete="new-password" required />
					</Field>
				</fieldset>
				<div class="mt-2">
					<Button type="submit">{hasPassword ? 'Update password' : 'Set password'}</Button>
				</div>
			</form>
		</Card>
	</div>
</PageLayout>
