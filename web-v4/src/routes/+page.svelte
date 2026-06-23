<script lang="ts">
	import SigninForm from '$lib/components/forms/SigninForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main class="w-full max-w-(--max-content) mx-auto">
	<div class="flex min-h-screen flex-col items-center p-8">
		<div class="flex flex-1 flex-col items-center justify-center my-4">
			<img src="/logo.png" alt="Spanner" class="h-14 w-auto block dark:hidden" />
			<img src="/logo-white.png" alt="Spanner" class="hidden dark:block h-14 w-auto" />
		</div>
		<div class="flex flex-[3] mb-6 flex-col items-center justify-start">
			<div class="p-10 border border-ink-200 bg-surface shadow-lg rounded-xl">
				<h1 class="h1 mb-4">{form?.status === 'pending' ? 'Check your email' : 'Sign in'}</h1>
				<SigninForm {form} />
			</div>
		</div>
	</div>
</main>
