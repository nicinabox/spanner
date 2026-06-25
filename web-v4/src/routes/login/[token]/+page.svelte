<script lang="ts">
	import { Button } from '$lib';
	import Card from '$lib/components/common/Card.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex min-h-screen max-w-prose mx-auto flex-col items-center justify-center px-4">
	<Card size="lg">
		<h1>Sorry, that login didn't work</h1>
		<p class="text-lg mb-6">
			This login link may have expired or already been used. Login links are valid for 15 minutes
			and can only be used once.
		</p>
		<Button href="/" variant="solid" block>Try again</Button>
	</Card>
</div>
