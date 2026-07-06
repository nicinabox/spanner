<script lang="ts">
	let { children } = $props();
</script>

<div class="container mx-auto my-6 rounded-lg p-8 bg-surface">
	{@render children()}
</div>
