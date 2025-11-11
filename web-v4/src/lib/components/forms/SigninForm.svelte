<script lang="ts">
	import { type ActionData } from '../../../routes/$types';

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
		<p>Check your email for a login token.</p>
		<fieldset class="mb-4 fieldset">
			<legend class="fieldset-legend">Enter login token</legend>
			<input type="text" class="input" name="token" autocomplete="off" />
		</fieldset>

		<button type="submit" class="btn btn-primary">Sign In</button>
	</form>
{:else}
	<form method="post" action="?/create">
		<fieldset class="mb-4 fieldset">
			<legend class="fieldset-legend">Enter your email to get started</legend>
			<input type="email" class="input" name="email" {placeholder} />
			<p class="label">First time? We'll set your account up automagically.</p>
		</fieldset>

		<button type="submit" class="btn btn-primary">Next</button>
	</form>
{/if}
