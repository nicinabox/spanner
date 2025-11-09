<script lang="ts">
	let { children } = $props();
</script>

<main class="isolate overflow-auto px-8">
	<div class="container mx-auto my-8">
		{@render children()}
	</div>
</main>
