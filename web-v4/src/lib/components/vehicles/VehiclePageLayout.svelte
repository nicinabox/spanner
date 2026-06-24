<script lang="ts">
	import { Button } from '$lib';
	import PageLayout from '$lib/components/common/PageLayout.svelte';
	import Menu from '$lib/components/common/Menu.svelte';
	import VehicleColorIndicator from '$lib/components/vehicles/VehicleColorIndicator.svelte';
	import { ArrowLeft, BookOpenText, FileText, Bell, CalendarClock } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { Vehicle } from '$lib/data/vehicles';
	import { MediaQuery } from 'svelte/reactivity';

	interface Props {
		vehicle: Vehicle;
		activeTab: string;
		children: Snippet;
	}

	let { vehicle, activeTab, children }: Props = $props();

	const isSmallScreen = new MediaQuery('(max-width: 640px');

	let tabs = [
		{ value: 'history', label: 'History', href: `/vehicles/${vehicle.id}`, icon: BookOpenText },
		{ value: 'notes', label: 'Notes', href: `/vehicles/${vehicle.id}/notes`, icon: FileText },
		{
			value: 'reminders',
			label: 'Reminders',
			href: `/vehicles/${vehicle.id}/reminders`,
			icon: Bell
		}
		// {
		// 	value: 'schedules',
		// 	label: 'Schedules',
		// 	href: `/vehicles/${vehicle.id}/schedules`,
		// 	icon: CalendarClock
		// }
	] as const;
</script>

{#snippet appbarEnd()}{/snippet}

<PageLayout
	appbarEnd={isSmallScreen.current ? appbarEnd : undefined}
	appbarClass="grid grid-cols-[1fr_auto_1fr] max-sm:grid-cols-2 items-center gap-3 p-2"
>
	{#snippet appbarStart()}
		<div class="flex gap-2">
			<Button href="/vehicles" variant="neutral" theme="dark" icon={isSmallScreen.current}>
				<ArrowLeft size={16} />
				{#if !isSmallScreen.current}Vehicles{/if}
			</Button>

			<Menu
				variant="tertiary"
				theme="dark"
				items={[
					{ value: 'edit', label: 'Edit', href: `/vehicles/${vehicle.id}/edit` },
					{ value: 'color', label: 'Change Color' },
					{ value: 'retire', label: 'Retire' }
				]}
			>
				{#snippet trigger()}
					<VehicleColorIndicator color={vehicle.color} size={6} /> {vehicle.name}
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
				</Button>
			{/each}
		</div>
	{/snippet}

	{@render children()}
</PageLayout>
