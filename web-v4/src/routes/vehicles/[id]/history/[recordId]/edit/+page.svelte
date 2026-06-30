<script lang="ts">
	import { Button, Card, Confirm } from '$lib';
	import VehiclePageLayout from '$lib/components/vehicles/VehiclePageLayout.svelte';
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import { enhance } from '$app/forms';
	import { invalidate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageProps } from './$types';
	import { pageTitle } from '$lib/utils/site';

	let { data }: PageProps = $props();

	let vehicle = $derived(data.vehicle);
	let record = $derived(data.record);

	let activeTab = $derived(
		$page.url.pathname === `/vehicles/${vehicle.id}/history/${record.id}/edit`
			? 'history'
			: 'history',
	);
</script>

<svelte:head>
	<title>{pageTitle('Edit Record', data.vehicle.name)}</title>
</svelte:head>

<VehiclePageLayout
	{vehicle}
	{activeTab}
	backAction={{ href: `/vehicles/${vehicle.id}`, label: 'Back' }}
>
	<div class="max-w-2xl mx-auto">
		<Card variant="outline" bleed>
			<h1 class="text-xl font-semibold">Edit Record</h1>
			<RecordForm {vehicle} {record} action="?/update" />
		</Card>

		<Card class="mt-6" variant="outline" bleed>
			<h1 class="text-xl">Danger Zone</h1>

			<fieldset>
				<div class="flex items-center justify-between gap-6">
					<div>
						<span class="font-medium">Permanently delete</span>
						<p class="text-sm text-ink-500">This record will be permanently deleted.</p>
					</div>
					<Confirm title="Delete record?">
						{#snippet trigger({ onOpenChange })}
							<Button danger onclick={() => onOpenChange(true)}>Delete</Button>
						{/snippet}
						{#snippet actions({ onOpenChange })}
							<form
								method="POST"
								action="?/delete"
								use:enhance={() => {
									return async ({ result }) => {
										if (result.type === 'redirect') {
											await invalidate(() => true);
											goto(result.location, { invalidateAll: true });
										}
									};
								}}
								class="flex flex-row gap-2 flex-1 sm:flex-none"
							>
								<Button type="submit" danger class="flex-1 sm:flex-none">Delete</Button>
								<Button
									variant="outline"
									class="flex-1 sm:flex-none"
									onclick={() => onOpenChange(false)}
								>
									Cancel
								</Button>
							</form>
						{/snippet}
						<p>This record will be permanently deleted.</p>
					</Confirm>
				</div>
			</fieldset>
		</Card>
	</div>
</VehiclePageLayout>
