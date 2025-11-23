<script lang="ts">
	interface Props {
		title: string;
		value: string | number | null | undefined;
		class?: string;
	}

	let { title, value, ...props }: Props = $props();
</script>

{#if value}
	<div class="min-w-fit py-2 {props.class}">
		<div class="text-sm text-muted-foreground">{title}</div>
		<div class="text-xl font-bold">{value}</div>
	</div>
{/if}
