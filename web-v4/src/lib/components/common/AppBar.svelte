<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Session } from '$lib/data/session';

	interface Props {
		start?: Snippet;
		center?: Snippet;
		end?: Snippet;
		session?: Session | null;
	}

	let { start, center, end, session }: Props = $props();
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
			<span class="text-light">{session.email}</span>
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
		padding-block: var(--space-sm);
		padding-inline: var(--main-padding);
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
	}

	.appbar-logo img {
		height: 1.8rem;
		width: auto;
	}
</style>
