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
		className
	)}
>
	<div>
		{@render start?.()}
	</div>
	<div class="flex justify-center overflow-x-auto max-sm:col-span-2 max-sm:row-start-2">
		{#if center}
			{@render center()}
		{:else}
			<a href="/">
				<img src="/logo-white.png" alt="Spanner" class="h-[1.8rem] w-auto" />
			</a>
		{/if}
	</div>
	<div class="flex justify-end items-center gap-3">
		{#if end}
			{@render end()}
		{:else if session}
			<Menu
				trigger={username}
				theme="dark"
				items={[{ value: 'signout', label: 'Sign out', href: '/logout', preload: false }]}
			/>
			<ThemeToggle />
		{/if}
	</div>
</header>
