<script lang="ts">
	import { Button, Card, Confirm } from '$lib';
	import { umamiEvent } from '$lib/umami';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import TaskForm from '$lib/components/forms/TaskForm.svelte';
	import DeferForm from '$lib/components/forms/DeferForm.svelte';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data, form }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let schedule = $derived(data.schedule);
</script>

<svelte:head>
	<title>{pageTitle('Edit Task', data.vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout
	{vehicle}
	activeTab="tasks"
	backAction={{ href: `/vehicles/${vehicle.id}/tasks`, label: 'Back' }}
>
	<div class="max-w-2xl mx-auto">
		<Card variant="outline" bleed>
			<h1 class="text-xl font-semibold">Edit Task</h1>
			<TaskForm {vehicle} {schedule} action="?/update" errors={form?.errors} />
		</Card>

		{#if schedule}
			<Card variant="outline" class="mt-6" bleed>
				<h2 class="text-xl">Defer</h2>
				<p class="text-sm text-ink-500 mb-4">
					Push the due date without completing the service. Deferral is relative to the original
					scheduled due date.
				</p>
				<DeferForm {vehicle} {schedule} />
			</Card>
		{/if}

		<Card class="mt-6" variant="outline" bleed>
			<h1 class="text-xl">Danger Zone</h1>

			<fieldset>
				<div class="flex items-center justify-between gap-6">
					<div>
						<span class="font-medium">Permanently delete</span>
						<p class="text-sm text-ink-500">Removes the schedule and its history.</p>
					</div>
					<Confirm title="Delete task?">
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
						<p>This task will be permanently deleted.</p>
					</Confirm>
				</div>
			</fieldset>
		</Card>
	</div>
</VehiclePageLayout>
