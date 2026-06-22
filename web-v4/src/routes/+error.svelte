<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib';
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="flex flex-col items-center gap-1 text-center">
		<p class="text-3xl font-bold">
			{page.status}
		</p>
		<h1 class="text-xl font-semibold mb-4">
			{page.status === 404 ? 'Page not found' : 'Something went wrong'}
		</h1>
		<Button href="/">Go home</Button>
	</div>
</div>
