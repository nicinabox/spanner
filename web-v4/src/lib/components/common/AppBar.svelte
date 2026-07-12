<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { Session } from '$lib/data/session';
	import Menu from './Menu.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	interface Props {
		start?: Snippet;
		center?: Snippet;
		end?: Snippet;
		session?: Session | null;
		class?: string;
	}

	let { start, center, end, session, class: className = '' }: Props = $props();

	let username = $derived(session?.email?.split('@')[0] ?? '');
</script>

<header
	class={cn(
		'sticky top-0 z-40 bg-brand-500 text-ink-50 shadow-md',
		'flex flex-wrap items-center *:flex-1 gap-3 p-2',
		className,
	)}
>
	<div data-start>
		{@render start?.()}
	</div>
	<div
		data-center
		class="flex justify-center overflow-x-auto max-sm:col-span-2 max-sm:row-start-2 pb-2 -mb-2 max-sm:-mx-2"
	>
		{#if center}
			{@render center()}
		{:else}
			<a href="/">
				<img src="/icons/app-icon-white.png" alt="Spanner" class="h-[1.8rem] w-auto" />
			</a>
		{/if}
	</div>
	<div data-end class="flex justify-end items-center gap-3">
		{#if end}
			{@render end()}
		{:else if session}
			<Menu
				theme="dark"
				size="sm"
				items={[
					{ value: 'settings', label: 'Settings', href: '/settings', preload: false },
					{ value: 'signout', label: 'Sign out', href: '/logout', preload: false },
				]}
			>
				{username}
				{#snippet start()}
					<span class="text-ink-500 text-sm font-medium">
						{session.email}
					</span>
				{/snippet}
			</Menu>
			<ThemeToggle size="sm" />
		{/if}
	</div>
</header>
