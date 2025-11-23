<script lang="ts">
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
	<form method="post" action="?/signin">
		<p class="mb-2">Check your email for a login token.</p>
		<fieldset class="fieldset">
			<TextField
				errors={form.errors}
				name="token"
				autocomplete="off"
				label="Enter login token"
				required
			/>
		</fieldset>

		<Button type="submit">Sign In</Button>
	</form>
{:else}
	<form method="post" action="?/create">
		<fieldset class="fieldset">
			<TextField
				label="Enter your email to get started"
				errors={form?.errors}
				{placeholder}
				name="email"
				hint="First time? We'll set your account up automagically."
			/>
		</fieldset>

		<Button type="submit">Next</Button>
	</form>
{/if}
