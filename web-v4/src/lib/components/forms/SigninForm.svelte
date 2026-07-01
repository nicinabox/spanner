<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib';
	import { hydratable } from 'svelte';
	import { type ActionData } from '../../../routes/$types';
	import Field from '../common/Field.svelte';
	import Input from '../common/Input.svelte';
	import Alert from '../common/Alert.svelte';
	import type { FormError } from '$lib/utils/form';
	import { getTimeZoneOffset } from '$lib/data/client';

	interface Props {
		form: ActionData;
		emailEnabled: boolean;
	}

	type FormErrors = { errors?: FormError[] };

	const tzOffset = getTimeZoneOffset();

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

	let mode = $state<'default' | 'password'>(emailEnabled ? 'default' : 'password');
	let email = $state('');
	let password = $state('');
	let emailError = $state('');
	let formErrors = $state<FormError[]>([]);

	// Sync with server form errors, resetting on mode change
	$effect(() => {
		formErrors = (form as FormErrors)?.errors ?? [];
	});

	// When password manager fills the password field in default mode, transition to password mode
	$effect(() => {
		if (mode === 'default' && password) {
			mode = 'password';
		}
	});
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
{:else}
	<form method="post" action="?/login" use:enhance class="w-full">
		<input type="hidden" name="timeZoneOffset" value={tzOffset} />
		{#if formErrors.length > 0}
			<Alert class="mb-4">
				{formErrors[0]?.title || 'Invalid email or password'}
			</Alert>
		{/if}

		<fieldset class="fieldset min-w-0">
			<Field
				label="Email"
				errors={emailError
					? [{ id: 'email', title: emailError }]
					: formErrors.filter((e: FormError) => e.id === 'email')}
				hint={mode === 'default' ? "New here? We'll create your account automatically." : undefined}
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

		<fieldset class="fieldset min-w-0" class:sr-only={mode === 'default'}>
			<Field label="Password" name="password" required>
				<Input
					name="password"
					type="password"
					autocomplete="current-password"
					value={password}
					oninput={(e) => {
						password = (e.target as HTMLInputElement).value;
					}}
					required={mode === 'password'}
				/>
			</Field>
		</fieldset>

		<div class="mt-4 flex flex-col gap-3">
			{#if mode === 'default'}
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
							formErrors = [];
						} else {
							emailError = 'Enter your email first';
						}
					}}
				>
					Sign in with password
				</Button>
			{:else}
				<Button type="submit" block>Sign in</Button>
				<Button variant="ghost" block href={`/reset-password?email=${encodeURIComponent(email)}`}
					>Forgot password?</Button
				>
				{#if emailEnabled}
					<Button
						variant="ghost"
						block
						onclick={() => {
							mode = 'default';
							formErrors = [];
						}}>Back</Button
					>
				{/if}
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
