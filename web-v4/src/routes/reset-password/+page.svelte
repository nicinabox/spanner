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
		<Card size="lg">
			{#if form?.status === 'pending'}
				<h1>Check your email</h1>
				<p class="mt-2 text-ink-500">
					If an account with that email exists and has a password, you'll receive a reset link shortly.
				</p>
				<div class="mt-4">
					<Button href="/" variant="ghost" block>Back to sign in</Button>
				</div>
			{:else}
				<h1>Reset password</h1>
				<p class="mt-2 text-ink-500 mb-4">
					Enter your email and we'll send you a link to reset your password.
				</p>
				<form method="post" action="?/request" use:enhance>
					<fieldset class="fieldset">
						<Field name="email" label="Email" errors={form?.errors} required>
							<Input name="email" type="email" autocomplete="email" required />
						</Field>
					</fieldset>
					<div class="mt-4 flex flex-col gap-3">
						<Button type="submit" block>Send reset link</Button>
						<Button href="/" variant="ghost" block>Back to sign in</Button>
					</div>
				</form>
			{/if}
		</Card>
	</div>
</main>
