<script lang="ts">
	interface Props {
		title: string;
		value: string | number | null | undefined;
		class?: string;
	}

	let { title, value, ...props }: Props = $props();
</script>

{#if value}
	<div class="min-w-fit py-2 whitespace-nowrap {props.class}">
		<div class="text-sm text-ink-500">{title}</div>
		<div class="text-xl font-semibold">{value}</div>
	</div>
{/if}
