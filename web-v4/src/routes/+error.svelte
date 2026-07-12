<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib';
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="flex flex-col gap-1">
		<h1 class="text-3xl font-semibold">
			{page.status === 404 ? 'Page not found' : 'Something went wrong'}
		</h1>
		<p class="text-lg font-medium tracking-wider text-ink-500">
			HTTP {page.status}
		</p>
		<div class="flex gap-2 mt-4">
			<Button onclick={() => location.reload()}>Reload</Button>
			<Button onclick={() => history.back()} variant="outline">Back</Button>
		</div>
	</div>
</div>
