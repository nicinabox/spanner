<script lang="ts">
	interface Props {
		title: string;
		value: string | number | null | undefined;
		class?: string;
	}

	let { title, value, ...props }: Props = $props();
</script>

{#if value}
	<div class="stat border-0 p-0 {props.class}">
		<div class="stat-title">{title}</div>
		<div class="stat-value text-2xl font-medium">{value}</div>
	</div>
{/if}
