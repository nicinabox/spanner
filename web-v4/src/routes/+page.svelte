<script lang="ts">
	import type { PageProps } from './$types';

	const placeholderEmails = [
		'lando@cloudci.ty',
		'robertpaulson@loustave.rn',
		'drspaceman@rockefellerpla.ce',
		'mal@firef.ly',
		'tina@belcher.burg',
		'jules.vincent@vega',
		'sarah.connor@future',
		'neo@matrix',
		'marty@hillval.ley',
		'bender@bendingun.it',
		'frodo@bagend.shire'
	];

	const placeholder = placeholderEmails[Math.floor(Math.random() * placeholderEmails.length)];

	let { form }: PageProps = $props();
</script>

<h1>Sign In</h1>

{#if form?.status === 'pending'}
	<form method="post" action="?/signin">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Enter login token</legend>
			<input type="text" class="input" name="token" autocomplete="off" />
		</fieldset>

		<button type="submit" class="brn-primary btn">Sign In</button>
	</form>
{:else}
	<form method="post" action="?/create">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Enter your email to get started</legend>
			<input type="email" class="input" name="email" {placeholder} />
			<p class="label">First time? We'll set your account up automagically.</p>
		</fieldset>

		<button type="submit" class="brn-primary btn">Sign In</button>
	</form>
{/if}
