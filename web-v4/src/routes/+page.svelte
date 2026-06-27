<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import SigninForm from '$lib/components/forms/SigninForm.svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>{pageTitle()}</title>
</svelte:head>

<main class="max-w-md w-full mx-auto px-4">
	<div class="flex min-h-screen flex-col items-center">
		<div class="flex flex-1 flex-col items-center justify-center my-4">
			<img src="/icons/app-icon.png" alt="Spanner" class="h-14 w-auto block dark:hidden" />
			<img src="/icons/app-icon-white.png" alt="Spanner" class="hidden dark:block h-14 w-auto" />
		</div>
		<div class="flex flex-3 mb-6 flex-col items-center">
			<Card size="lg">
				<h1>{form?.status === 'pending' ? 'Check your email' : 'Sign in'}</h1>
				<SigninForm {form} />
			</Card>
		</div>
	</div>
</main>
