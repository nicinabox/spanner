<script lang="ts">
	import Tooltip from '../common/Tooltip.svelte';
</script>

<Tooltip content="Overdue">
	{#snippet children(props)}
		<div {...props} class="size-4.5 flex items-center justify-center">
			<span class="size-2 rounded-full bg-warning shrink-0"></span>
		</div>
	{/snippet}
</Tooltip>
