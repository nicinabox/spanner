<script lang="ts">
	import { Button } from '$lib';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="login-page">
	<div class="card lg">
		<header>
			<h1>Sorry, that login didn't work</h1>
		</header>
		<p class="text-lg mb-6">
			This login link may have expired or already been used. Login links are valid for 15 minutes
			and can only be used once.
		</p>
		<Button href="/" variant="primary" size="lg" block>Try again</Button>
	</div>
</div>

<style>
	.login-page {
		display: flex;
		min-height: 100vh;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-md);
	}

	.card {
		width: 100%;
		max-width: 500px;
	}
</style>
