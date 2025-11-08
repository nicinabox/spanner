<script lang="ts">
	type Props = {
		title: string;
		value: string | number;
	};

	let { title, value }: Props = $props();
</script>

<div class="stat">
	<div class="stat-title">{title}</div>
	<div class="stat-value">{value}</div>
</div>
