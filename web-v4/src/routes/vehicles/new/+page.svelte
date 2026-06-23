<script lang="ts">
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="max-w-xl mx-auto">
	<h1 class="text-xl mb-6">New Vehicle</h1>
	<VehicleForm errors={form?.errors} />
</div>
