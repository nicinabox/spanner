<script lang="ts">
	import { Button } from '$lib';
	import Card from '$lib/components/common/Card.svelte';
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import { useAppBarSetters } from '$lib/stores/appbar.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	let { setStart } = useAppBarSetters();
	setStart(backButton);
</script>

{#snippet backButton()}
	<Button href="/vehicles" variant="neutral" theme="dark">
		<ArrowLeft size={16} /> Vehicles
	</Button>
{/snippet}

<div class="max-w-xl mx-auto">
	<Card>
		<h1>New Vehicle</h1>
		<VehicleForm errors={form?.errors} />
	</Card>
</div>
