<script lang="ts">
	import SigninForm from '$lib/components/forms/SigninForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main class="container mx-auto">
	<div class="flex min-h-screen flex-col items-center p-8">
		<div class="flex flex-1 flex-col items-center justify-center">
			<img src="/logo.png" alt="Spanner" class="h-14 w-auto dark:hidden" />
			<img src="/logo-white.png" alt="Spanner" class="hidden h-14 w-auto dark:block" />
		</div>
		<div class="flex flex-[3] flex-col items-center justify-start">
			<div class="w-full max-w-[400px] rounded-xl border bg-card p-8 shadow-sm">
				<h1 class="h1">{form?.status === 'pending' ? 'Check your email' : 'Sign in'}</h1>
				<SigninForm {form} />
			</div>
		</div>
	</div>
</main>
