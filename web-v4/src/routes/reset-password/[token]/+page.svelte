<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Field, Input } from '$lib';
	import { pageTitle } from '$lib/utils/site';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>{pageTitle('Reset Password')}</title>
</svelte:head>

<main class="max-w-md w-full mx-auto px-4">
	<div class="flex min-h-screen flex-col items-center justify-center">
		<Card size="lg" class="w-full">
			{#if form?.errors && form.errors.some( (e: { title?: string }) => e.title?.includes('Invalid or expired'), )}
				<h1>Link expired</h1>
				<p class="mt-2 text-ink-500">
					This reset link is invalid or has expired. Please request a new one.
				</p>
				<div class="mt-4">
					<Button href="/reset-password" block>Request new link</Button>
				</div>
			{:else}
				<h1>Change password</h1>
				<form method="post" action="?/resetPassword" use:enhance class="mt-4">
					<fieldset>
						<Field name="password" label="New password" errors={form?.errors} required>
							<Input name="password" type="password" autocomplete="new-password" required />
						</Field>
						<Field name="confirm_password" label="Confirm password" errors={form?.errors} required>
							<Input name="confirm_password" type="password" autocomplete="new-password" required />
						</Field>
					</fieldset>
					<div class="mt-4">
						<Button type="submit" block>Set password</Button>
					</div>
				</form>
			{/if}
		</Card>
	</div>
</main>
