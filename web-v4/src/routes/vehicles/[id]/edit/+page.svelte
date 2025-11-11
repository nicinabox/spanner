<script lang="ts">
	import FormField from '$lib/components/FormField.svelte';
	import type { PageProps } from './$types';

	let { form, data }: PageProps = $props();
</script>

<form method="post">
	{#if form?.error}
		<p>{form.error}</p>
	{/if}

	<fieldset class="fieldset">
		<FormField {form} name="name" label="Name" value={data.vehicle.name} />
		<FormField
			{form}
			name="vin"
			label="VIN"
			hint="VIN is optional but recommended"
			value={data.vehicle.vin}
		/>
	</fieldset>

	<button class="btn btn-primary" type="submit">Save</button>
</form>
