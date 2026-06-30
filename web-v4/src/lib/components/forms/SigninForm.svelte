<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib';
	import { hydratable } from 'svelte';
	import { type ActionData } from '../../../routes/$types';
	import Field from '../common/Field.svelte';
	import Input from '../common/Input.svelte';

	interface Props {
		form: ActionData;
		emailEnabled: boolean;
	}

	const placeholderEmails = [
		'lando@cloudcity',
		'robertpaulson@loustavern',
		'drspaceman@rockefellerplace',
		'mal@firefly',
		'tina@belcherburg',
		'jules.vincent@vega',
		'sarah.connor@future',
		'neo@matrix',
		'marty@hillvalley',
		'bender@bendinguniverse',
		'frodo@bagendshire',
	];

	let placeholder = hydratable(
		'placeholder',
		() => placeholderEmails[Math.floor(Math.random() * placeholderEmails.length)],
	);

	let { form, emailEnabled }: Props = $props();
	let mode = $state<'default' | 'password'>('default');
</script>

{#if form?.status === 'pending'}
	<!-- Manual token entry (preserved for PWA/native clients) -->
	<form method="post" action="?/signin" use:enhance>
		<p class="mb-4 text-lg">
			We sent a sign-in link to your email. Click the link to sign in instantly.
		</p>

		<div class="my-6 flex items-center gap-4">
			<div class="text-xs text-ink-500 font-medium tracking-wider divider">OR</div>
		</div>

		<fieldset class="fieldset">
			<Field name="token" label="Enter your token" errors={form.errors}>
				<Input name="token" autocomplete="off" required />
			</Field>
		</fieldset>

		<div class="mt-4 flex flex-col gap-3">
			<Button type="submit" block>Sign in</Button>
			<Button href="/" variant="ghost" block>Back</Button>
		</div>
	</form>
{:else if mode === 'password'}
	<!-- Password mode -->
	{#if form?.errors && form.errors.length > 0 && !form.errors[0]?.id}
		<div class="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
			{form.errors[0]?.title || 'Invalid email or password'}
		</div>
	{/if}
	<form method="post" action="?/login" use:enhance>
		<fieldset class="fieldset">
			<Field label="Email" name="email" required>
				<Input {placeholder} type="email" name="email" autocomplete="email" required />
			</Field>
			<Field
				label="Password"
				name="password"
			>
				<Input name="password" type="password" autocomplete="current-password" />
			</Field>
		</fieldset>

		<div class="mt-4 flex flex-col gap-3">
			<Button type="submit" block>Sign in</Button>
			<a href="/reset-password" class="text-sm text-ink-500 hover:text-ink-700 text-center">
				Forgot password?
			</a>
			<Button variant="ghost" block onclick={() => (mode = 'default')}>Back</Button>
		</div>
	</form>
{:else}
	<!-- Default: email + two buttons -->
	<form method="post" action="?/magicLink" use:enhance>
		<fieldset class="fieldset">
			<Field
				label="Email"
				errors={form?.errors}
				hint="New here? We'll create your account automatically."
				name="email"
				required
			>
				<Input {placeholder} type="email" name="email" autocomplete="email" required />
			</Field>
		</fieldset>

		<div class="mt-4 flex flex-col gap-3">
			<Button type="button" block onclick={() => (mode = 'password')}>Sign in with password</Button>
			{#if emailEnabled}
				<Button type="submit" variant="outline" block>Send me a link</Button>
			{/if}
		</div>
	</form>
{/if}

<style>
	.divider {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		&::before,
		&::after {
			content: '';
			background: var(--color-ink-100);
			flex-grow: 1;
			height: 2px;
		}
	}
</style>
