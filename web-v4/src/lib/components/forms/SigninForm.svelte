<script lang="ts">
	import { enhance } from '$app/forms';
	import { type ActionData } from '../../../routes/$types';
	import Button from '../ui/Button.svelte';
	import TextField from '../TextField.svelte';

	interface Props {
		form: ActionData;
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
		'frodo@bagendshire'
	];

	const placeholder = placeholderEmails[Math.floor(Math.random() * placeholderEmails.length)];

	let { form }: Props = $props();
</script>

{#if form?.status === 'pending'}
	<form method="post" action="?/signin" use:enhance>
		<p class="mb-4 text-muted-foreground">
			We sent a sign-in link to your email. Click the link to sign in instantly.
		</p>

		<div class="my-6 flex items-center gap-4">
			<div class="h-px flex-1 bg-border"></div>
			<span class="text-sm text-muted-foreground">Or</span>
			<div class="h-px flex-1 bg-border"></div>
		</div>

		<fieldset class="fieldset">
			<TextField
				errors={form.errors}
				name="token"
				autocomplete="off"
				label="Enter your token"
				required
			/>
		</fieldset>

		<div class="mt-6 flex flex-col gap-3">
			<Button type="submit" class="w-full">Sign in</Button>
			<Button href="/" variant="ghost" class="w-full">Back</Button>
		</div>
	</form>
{:else}
	<form method="post" action="?/create" use:enhance>
		<fieldset class="fieldset">
			<TextField
				label="Email"
				errors={form?.errors}
				{placeholder}
				name="email"
				hint="New here? We'll create your account automatically."
			/>
		</fieldset>

		<div class="mt-6">
			<Button type="submit" class="w-full">Continue</Button>
		</div>
	</form>
{/if}
