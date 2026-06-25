<script lang="ts">
	import { Button } from '$lib';
	import Menu from '$lib/components/common/Menu.svelte';
	import PageLayout from '$lib/components/common/PageLayout.svelte';
	import ShareDialog from '$lib/components/dialogs/ShareDialog.svelte';
	import VehicleColorIndicator from '$lib/components/vehicles/VehicleColorIndicator.svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { getOverdueRemindersCount } from '$lib/utils/reminders';
	import { enhance } from '$app/forms';
	import { ArrowLeft, Bell, BookOpenText, Check, FileText, Wrench } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import Badge from '../common/Badge.svelte';
	import { vehiclePath } from '$lib/routes';
	import { enhanceInline } from '$lib/utils/form';

	interface Props {
		vehicle: Vehicle;
		activeTab?: string;
		children: Snippet;
		backAction?: {
			href: string;
			label: string;
		};
		tabs?: Array<{
			value: string;
			label: string;
			href: string;
			icon: any;
			badge?: { count: number; icon: any };
		}>;
	}

	let {
		vehicle,
		activeTab,
		children,
		backAction = { href: '/vehicles', label: 'Vehicles' },
		tabs: customTabs,
	}: Props = $props();

	const isSmallScreen = new MediaQuery('(max-width: 640px');

	let shareOpen = $state(false);

	type Tab = {
		value: string;
		label: string;
		href: string;
		icon: any;
		badge?: { count: number; icon: any };
	};

	const tabs = $derived(
		(customTabs ?? [
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
		]) as Tab[],
	);
</script>

{#snippet appbarEnd()}{/snippet}

<PageLayout
	appbarEnd={isSmallScreen.current ? appbarEnd : undefined}
	appbarClass="grid grid-cols-[1fr_auto_1fr] max-sm:grid-cols-2 items-center gap-3 p-2"
>
	{#snippet appbarStart()}
		<div class="flex gap-2">
			<Button
				size="sm"
				href={backAction.href}
				color="neutral"
				theme="dark"
				icon={isSmallScreen.current}
			>
				<ArrowLeft size={16} />
				{#if !isSmallScreen.current}{backAction.label}{/if}
			</Button>

			<Menu
				variant="ghost"
				theme="dark"
				size="sm"
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
				{const active = $derived(activeTab === tab.value)}
				{const badge = tab.badge}

				<Button
					{active}
					href={tab.href}
					variant="ghost"
					theme="dark"
					pill
					size="sm"
					aria-current={active ? 'page' : undefined}
				>
					<tab.icon size={14} />
					{tab.label}

					{#if badge && badge.count}
						<Badge variant="warning" pill class="-mr-1">
							{#if badge.icon}
								<badge.icon size={14} />
							{/if}
							{badge.count}
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
	use:enhance={enhanceInline}
></form>

<ShareDialog {vehicle} bind:open={shareOpen} />
