<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Session } from '$lib/data/session';
	import Menu from './Menu.svelte';

	interface Props {
		start?: Snippet;
		center?: Snippet;
		end?: Snippet;
		session?: Session | null;
	}

	let { start, center, end, session }: Props = $props();

	let username = $derived(session?.email?.split('@')[0] ?? '');
</script>

<header
	class="sticky top-0 z-(--z-nav) flex flex-wrap items-center gap-3 p-2 bg-brand-500 text-ink-50 shadow-md"
>
	<div class="flex-1">
		{@render start?.()}
	</div>
	<div class="flex-1 flex justify-center">
		{#if center}
			{@render center()}
		{:else}
			<a href="/">
				<img src="/logo-white.png" alt="Spanner" class="h-[1.8rem] w-auto" />
			</a>
		{/if}
	</div>
	<div class="flex-1 flex justify-end gap-3 items-center">
		{#if end}
			{@render end()}
		{:else if session}
			<Menu
				trigger={username}
				theme="dark"
				class="text-white"
				items={[{ value: 'signout', label: 'Sign out', href: '/logout', preload: false }]}
			/>
		{/if}
	</div>
</header>
