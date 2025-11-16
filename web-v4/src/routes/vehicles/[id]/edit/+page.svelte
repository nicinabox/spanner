<script lang="ts">
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import type { PageProps } from './$types';

	let { form, data }: PageProps = $props();
</script>

<div class="container mx-auto max-w-xl">
	<VehicleForm {form} action="?/update" values={data.vehicle} />
</div>
