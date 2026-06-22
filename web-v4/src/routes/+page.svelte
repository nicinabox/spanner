<script lang="ts">
	import SigninForm from '$lib/components/forms/SigninForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main class="container mx-auto">
	<div class="flex min-h-screen flex-col items-center p-8">
		<div class="flex flex-1 flex-col items-center justify-center my-4">
			<img src="/logo.png" alt="Spanner" class="h-14 w-auto logo-light" />
			<img src="/logo-white.png" alt="Spanner" class="hidden h-14 w-auto logo-dark" />
		</div>
		<div class="flex flex-3 mb-6 flex-col items-center justify-start">
			<div class="card lg">
				<h1 class="h1 mb-4">{form?.status === 'pending' ? 'Check your email' : 'Sign in'}</h1>
				<SigninForm {form} />
			</div>
		</div>
	</div>
</main>

<style>
	.logo-light {
		display: block;
	}

	:global([data-theme='dark']) {
		.logo-light {
			display: none;
		}
		.logo-dark {
			display: block;
		}
	}

	.card {
		max-width: 400px;
	}
</style>
