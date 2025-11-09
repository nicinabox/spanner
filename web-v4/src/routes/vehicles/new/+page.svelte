<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<form method="post">
	<fieldset class="fieldset">
		<label class="label" for="name">Name</label>
		<input name="name" type="text" class="input" required />

		<label class="label" for="vin">VIN</label>
		<input name="vin" type="text" class="input" />
		<span class="label">VIN is optional but recommended</span>
	</fieldset>

	<button class="btn btn-primary" type="submit">Create Vehicle</button>
</form>
