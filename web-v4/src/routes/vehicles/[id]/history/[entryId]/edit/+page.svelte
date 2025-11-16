<script lang="ts">
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	const { data, form } = $props();
</script>

<div class="container mx-auto max-w-xl">
	<RecordForm {form} vehicle={data.vehicle} values={data.record} />
</div>
