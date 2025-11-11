<script lang="ts">
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<VehicleForm {form} />
