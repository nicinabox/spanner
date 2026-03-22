<script lang="ts">
	import SigninForm from '$lib/components/forms/SigninForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main class="container mx-auto">
	<div class="flex h-screen flex-col items-center justify-center">
		<div class="m-8 w-full rounded-xl border bg-card p-8 shadow-sm sm:w-[400px]">
			<h1 class="h1">{form?.status === 'pending' ? 'Check your email' : 'Sign in'}</h1>
			<SigninForm {form} />
		</div>
	</div>
</main>
