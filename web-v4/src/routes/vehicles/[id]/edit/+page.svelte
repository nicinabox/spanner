<script lang="ts">
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import type { PageProps } from './$types';

	let { form, data }: PageProps = $props();
</script>

<VehicleForm {form} values={data.vehicle} />
