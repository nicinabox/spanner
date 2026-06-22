<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Session } from '$lib/data/session';
	import { Button } from '$lib';
	import { LogOut } from 'lucide-svelte';
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

<header class="appbar">
	<div class="appbar-start">
		{@render start?.()}
	</div>
	<div class="appbar-center">
		{#if center}
			{@render center()}
		{:else}
			<a href="/" class="appbar-logo">
				<img src="/logo-white.png" alt="Spanner" />
			</a>
		{/if}
	</div>
	<div class="appbar-end">
		{#if end}
			{@render end()}
		{:else if session}
			<Menu
				trigger={username}
				theme="dark"
				class="text-light"
				items={[{ value: 'signout', label: 'Sign out', href: '/logout', preload: false }]}
			/>
		{/if}
	</div>
</header>

<style>
	.appbar {
		position: sticky;
		top: 0;
		z-index: var(--z-nav);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-2);
		background-color: var(--color-brand);
		color: var(--color-ink-inverted);
		box-shadow: var(--shadow-md);
	}

	.appbar-start {
		flex: 1;
	}

	.appbar-center {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.appbar-end {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		gap: var(--space-sm);
		align-items: center;
	}

	.appbar-logo img {
		height: 1.8rem;
		width: auto;
	}
</style>
