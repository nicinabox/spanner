<script lang="ts">
	import { Button } from '$lib';
	import Menu from '$lib/components/common/Menu.svelte';
	import PageLayout from '$lib/components/common/PageLayout.svelte';
	import ShareDialog from '$lib/components/dialogs/ShareDialog.svelte';
	import VehicleColorIndicator from '$lib/components/vehicles/VehicleColorIndicator.svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { getOverdueRemindersCount } from '$lib/utils/reminders';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { ArrowLeft, Bell, BookOpenText, Check, FileText, Wrench } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import Badge from '../common/Badge.svelte';
	import { vehiclePath } from '$lib/routes';

	interface Props {
		vehicle: Vehicle;
		activeTab?: string;
		children: Snippet;
		backAction?: {
			href: string;
			label: string;
		};
	}

	let {
		vehicle,
		activeTab,
		children,
		backAction = { href: '/vehicles', label: 'Vehicles' },
	}: Props = $props();

	const isSmallScreen = new MediaQuery('(max-width: 640px');

	let shareOpen = $state(false);

	const keepMounted: SubmitFunction =
		() =>
		async ({ result, update }) => {
			if (result.type === 'success') {
				await invalidateAll();
			} else {
				update();
			}
		};

	const tabs = $derived([
		{ value: 'history', label: 'History', href: `/vehicles/${vehicle.id}`, icon: BookOpenText },
		{
			value: 'reminders',
			label: 'Reminders',
			href: `/vehicles/${vehicle.id}/reminders`,
			badge: {
				count: getOverdueRemindersCount(vehicle),
				icon: Wrench,
			},
			icon: Bell,
		},
		{ value: 'notes', label: 'Notes', href: `/vehicles/${vehicle.id}/notes`, icon: FileText },
		// {
		// 	value: 'schedules',
		// 	label: 'Schedules',
		// 	href: `/vehicles/${vehicle.id}/schedules`,
		// 	icon: CalendarClock
		// }
	] as const);
</script>

{#snippet appbarEnd()}{/snippet}

<PageLayout
	appbarEnd={isSmallScreen.current ? appbarEnd : undefined}
	appbarClass="grid grid-cols-[1fr_auto_1fr] max-sm:grid-cols-2 items-center gap-3 p-2"
>
	{#snippet appbarStart()}
		<div class="flex gap-2">
			<Button href={backAction.href} variant="neutral" theme="dark" icon={isSmallScreen.current}>
				<ArrowLeft size={16} />
				{#if !isSmallScreen.current}{backAction.label}{/if}
			</Button>

			<Menu
				variant="tertiary"
				theme="dark"
				items={[
					{ value: 'edit', label: 'Edit', href: vehiclePath(vehicle.id, 'edit') },
					{ value: 'retire', label: 'Retire', closeOnSelect: false },
					{ value: '', separator: true },
					{ value: 'share', label: 'Share...', closeOnSelect: false },
					{ value: '', separator: true },
					{
						value: 'import-export',
						label: 'Import/Export History',
						href: vehiclePath(vehicle.id, 'transfer'),
					},
				]}
				onSelect={({ value }) => {
					if (value === 'retire') {
						const form = document.querySelector<HTMLFormElement>('form[action$="toggleRetire"]');
						form?.requestSubmit();
					}
					if (value === 'share') {
						shareOpen = true;
					}
				}}
			>
				{#snippet trigger()}
					<VehicleColorIndicator color={vehicle.color} size={6} /> {vehicle.name}
				{/snippet}
				{#snippet itemEnd(item)}
					{#if item.value === 'retire' && vehicle.retired}
						<Check size={16} />
					{:else if item.value === 'share'}
						<Badge variant={vehicle.preferences.enableSharing ? 'warning' : 'neutral'}>
							{vehicle.preferences.enableSharing ? 'Public' : 'Private'}
						</Badge>
					{/if}
				{/snippet}
			</Menu>
		</div>
	{/snippet}
	{#snippet appbarCenter()}
		<div class="flex flex-1 gap-1 flex-nowrap min-w-0">
			{#each tabs as tab}
				{const active = activeTab === tab.value}
				<Button
					{active}
					href={tab.href}
					variant="tertiary"
					theme="dark"
					radius="pill"
					aria-current={active ? 'page' : undefined}
				>
					<tab.icon size={14} />
					{tab.label}
					{#if 'badge' in tab && tab.badge.count}
						<Badge variant="warning" pill class="-mr-1">
							{#if tab.badge.icon}
								<tab.badge.icon size={14} />
							{/if}
							{tab.badge.count}
						</Badge>
					{/if}
				</Button>
			{/each}
		</div>
	{/snippet}

	{@render children()}
</PageLayout>

<form
	method="POST"
	action={`/vehicles/${vehicle.id}?/toggleRetire`}
	class="hidden"
	use:enhance={keepMounted}
></form>

<ShareDialog {vehicle} bind:open={shareOpen} />
