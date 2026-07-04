<script lang="ts">
	import { Button, Card, Confirm } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import ServiceScheduleForm from '$lib/components/forms/ServiceScheduleForm.svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let schedule = $derived(data.schedule);
	let classifications = $derived(data.classifications);
</script>

<svelte:head>
	<title>{pageTitle('Edit Service Task', data.vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout
	{vehicle}
	activeTab="schedules"
	backAction={{ href: `/vehicles/${vehicle.id}/schedules`, label: 'Back' }}
>
	<div class="max-w-2xl mx-auto">
		<Card variant="outline" bleed>
			<h1 class="text-xl font-semibold">Edit Service Task</h1>
			<ServiceScheduleForm {vehicle} {classifications} {schedule} action="?/update" />
		</Card>

		<Card class="mt-6" variant="outline" bleed>
			<h1 class="text-xl">Danger Zone</h1>

			<fieldset>
				<label class="flex items-center justify-between gap-6">
					<div>
						<span class="font-medium">Permanently delete</span>
						<p class="text-sm text-ink-500">This service task will be permanently deleted.</p>
					</div>
					<Confirm title="Delete service task?">
						{#snippet trigger({ onOpenChange })}
							<Button color="danger" variant="outline" onclick={() => onOpenChange(true)}
								>Delete</Button
							>
						{/snippet}
						{#snippet actions({ onOpenChange })}
							<form method="POST" action="?/delete" class="flex flex-row gap-2 flex-1 sm:flex-none">
								<Button
									type="submit"
									color="danger"
									variant="outline"
									class="flex-1 sm:flex-none"
									{...umamiEvent('delete_schedule')}>Delete</Button
								>
								<Button
									variant="solid"
									class="flex-1 sm:flex-none"
									onclick={() => onOpenChange(false)}
								>
									Cancel
								</Button>
							</form>
						{/snippet}
						<p>This service task will be permanently deleted.</p>
					</Confirm>
				</label>
			</fieldset>
		</Card>
	</div>
</VehiclePageLayout>
