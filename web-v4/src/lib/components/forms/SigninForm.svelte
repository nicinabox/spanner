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
	let email = $state('');
	let emailError = $state('');


</script>

{#if form?.status === 'pending'}
	<form method="post" action="?/signin" use:enhance class="w-full">
		<p class="mb-4 text-lg">
			We sent a sign-in link to your email. Click the link to sign in instantly.
		</p>

		<div class="my-6 flex items-center gap-4">
			<div class="text-xs text-ink-500 font-medium tracking-wider divider">OR</div>
		</div>

		<fieldset class="fieldset min-w-0">
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
	{#if form?.errors && form.errors.length > 0}
		<div class="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
			{form.errors[0]?.title || 'Invalid email or password'}
		</div>
	{/if}
	<form method="post" action="?/login" use:enhance class="w-full">
		<input type="hidden" name="email" value={email} />
		<fieldset class="fieldset min-w-0">
			<div class="text-base text-ink-900 mb-2">{email}</div>
			<Field label="Password" name="password">
				<Input name="password" type="password" autocomplete="current-password" required />
			</Field>
		</fieldset>

		<div class="mt-4 flex flex-col gap-3">
			<Button type="submit" block>Sign in</Button>
			<Button variant="ghost" block href={`/reset-password?email=${encodeURIComponent(email)}`}>Forgot password?</Button>
			<Button variant="ghost" block onclick={() => { mode = 'default'; }}>Back</Button>
		</div>
	</form>
{:else}
	<form method="post" action="?/magicLink" use:enhance class="w-full">
		<fieldset class="fieldset min-w-0">
			<Field
				label="Email"
				errors={emailError
					? [{ id: 'email', title: emailError }]
					: form?.errors?.filter((e) => e.id === 'email')}
				hint="New here? We'll create your account automatically."
				name="email"
				required
			>
				<Input
					{placeholder}
					type="email"
					name="email"
					autocomplete="email"
					value={email}
					oninput={(e) => {
						email = (e.target as HTMLInputElement).value;
						emailError = '';
					}}
					required
				/>
			</Field>
		</fieldset>

		<div class="mt-4 flex flex-col gap-3">
			{#if emailEnabled}
				<Button type="submit" variant="solid" block>Send me a link</Button>
			{/if}
			<Button
				type="button"
				variant="outline"
				block
				onclick={() => {
					if (email.trim()) {
						mode = 'password';
					} else {
						emailError = 'Enter your email first';
					}
				}}
			>
				Sign in with password
			</Button>
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
