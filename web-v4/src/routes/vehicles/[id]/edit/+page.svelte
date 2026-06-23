<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import type { PageProps } from './$types';

	let { form, data }: PageProps = $props();
</script>

<div class="max-w-xl mx-auto">
	<Card>
		<h1 class="text-xl mb-6">Edit {data.vehicle.name}</h1>
		<VehicleForm errors={form?.errors} values={data.vehicle} action="?/update" />
	</Card>
</div>
