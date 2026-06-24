<script lang="ts">
	import { Button } from '$lib';
	import Card from '$lib/components/common/Card.svelte';
	import PageLayout from '$lib/components/common/PageLayout.svelte';
	import VehicleForm from '$lib/components/forms/VehicleForm.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { form, data }: PageProps = $props();
</script>

<PageLayout>
	{#snippet appbarStart()}
		<Button href="/vehicles/{data.vehicle.id}" variant="neutral" theme="dark">
			<ArrowLeft size={16} />
			{data.vehicle.name}
		</Button>
	{/snippet}

	<div class="max-w-xl mx-auto">
		<Card>
			<h1 class="text-xl">Edit {data.vehicle.name}</h1>
			<VehicleForm errors={form?.errors} values={data.vehicle} action="?/update" />
		</Card>

		<form method="post">
			<Card class="mt-6" variant="outline">
				<h1 class="text-xl">Danger Zone</h1>

				<fieldset>
					<label class="flex items-center justify-between gap-3 cursor-pointer">
						<div>
							<span class="font-medium">Permanently delete</span>
							<p class="text-sm text-ink-500">
								Remove all history, reminders, notes permanently. This cannot be undone.
							</p>
						</div>
						<Button type="submit" formaction="?/delete" danger>Delete</Button>
					</label>
				</fieldset>
			</Card>
		</form>
	</div>
</PageLayout>
