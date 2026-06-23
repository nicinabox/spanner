<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="max-w-xl mx-auto">
	<Card>
		<h1>New Vehicle</h1>
		<VehicleForm errors={form?.errors} />
	</Card>
</div>
