<script lang="ts">
	import SigninForm from '$lib/components/forms/SigninForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main class="container mx-auto">
	<div class="flex h-screen flex-col items-center justify-center">
		<div class="m-8 w-full rounded-md bg-base-200 p-8 shadow-md sm:w-[400px]">
			<h1 class="h1">Sign In</h1>
			<SigninForm {form} />
		</div>
	</div>
</main>
