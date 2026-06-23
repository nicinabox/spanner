<script lang="ts">
	import { Button } from '$lib';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center p-4">
	<div class="p-10 border border-ink-200 bg-surface shadow-lg rounded-xl">
		<header class="mb-4">
			<h1>Sorry, that login didn't work</h1>
		</header>
		<p class="text-lg mb-6">
			This login link may have expired or already been used. Login links are valid for 15 minutes
			and can only be used once.
		</p>
		<Button href="/" variant="primary" size="lg" block>Try again</Button>
	</div>
</div>
