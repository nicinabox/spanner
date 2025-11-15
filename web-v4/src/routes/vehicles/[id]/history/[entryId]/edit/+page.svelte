<script lang="ts">
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	const { data, form } = $props();
</script>

<RecordForm {form} vehicle={data.vehicle} values={data.record} />
