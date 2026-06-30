<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import SigninForm from '$lib/components/forms/SigninForm.svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';
	import AppIcon from '$lib/components/common/AppIcon.svelte';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>{pageTitle()}</title>
</svelte:head>

<main class="max-w-md w-full mx-auto px-4">
	<div class="flex min-h-screen flex-col items-center">
		<div class="flex flex-1 flex-col items-center justify-center my-4">
			<AppIcon />
		</div>
		<div class="flex flex-3 mb-6 flex-col items-center">
			<Card size="lg">
				<h1>{form?.status === 'pending' ? 'Check your email' : 'Sign in'}</h1>
				<SigninForm {form} emailEnabled={data.emailEnabled} />
			</Card>
		</div>
	</div>
</main>
